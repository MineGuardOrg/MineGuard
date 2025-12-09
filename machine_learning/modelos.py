import joblib
import json
import numpy as np

print("=" * 50)
print("🔄 CONVIRTIENDO MODELO A JSON")
print("=" * 50)

# ===============================
# 1️⃣ CARGAR MODELO ENTRENADO
# ===============================
try:
    model = joblib.load("modelo_riesgo.pkl")
    print("✅ Modelo cargado exitosamente")
    print(f"   - Tipo: {type(model).__name__}")
    print(f"   - Número de árboles: {model.n_estimators}")
    print(f"   - Características: {model.n_features_in_}")
except FileNotFoundError:
    print("❌ ERROR: No se encontró 'modelo_riesgo.pkl'")
    print("   Asegúrate de haber ejecutado el entrenamiento primero")
    exit(1)

# ===============================
# 2️⃣ EXTRAER ESTRUCTURA DE ÁRBOLES
# ===============================
def extract_tree_structure(tree):
    """Extrae la estructura completa de un árbol de decisión"""
    n_nodes = tree.node_count
    children_left = tree.children_left
    children_right = tree.children_right
    feature = tree.feature
    threshold = tree.threshold
    value = tree.value
    
    nodes = []
    for i in range(n_nodes):
        node = {
            'id': int(i),
            'feature': int(feature[i]) if feature[i] >= 0 else -1,
            'threshold': float(threshold[i]) if threshold[i] != -2 else None,
            'left_child': int(children_left[i]) if children_left[i] != -1 else None,
            'right_child': int(children_right[i]) if children_right[i] != -1 else None,
            'value': value[i].tolist()
        }
        nodes.append(node)
    
    return nodes

# ===============================
# 3️⃣ CONVERTIR RANDOM FOREST A JSON
# ===============================
print("\n📦 Extrayendo estructura de árboles...")

model_data = {
    'model_type': 'RandomForestClassifier',
    'n_estimators': int(model.n_estimators),
    'n_classes': int(model.n_classes_),
    'n_features': int(model.n_features_in_),
    'max_depth': int(model.max_depth) if model.max_depth else None,
    'classes': model.classes_.tolist(),
    'trees': []
}

# Extraer cada árbol
total_nodes = 0
for i, estimator in enumerate(model.estimators_):
    tree = estimator.tree_
    tree_structure = extract_tree_structure(tree)
    model_data['trees'].append(tree_structure)
    total_nodes += len(tree_structure)
    
    # Mostrar progreso
    if (i + 1) % 20 == 0 or i == 0:
        print(f"   Árbol {i+1}/{model.n_estimators} - Nodos: {len(tree_structure)}")

print(f"\n✅ Extracción completada:")
print(f"   - Total de árboles: {len(model_data['trees'])}")
print(f"   - Total de nodos: {total_nodes}")
print(f"   - Promedio de nodos por árbol: {total_nodes / len(model_data['trees']):.1f}")

# ===============================
# 4️⃣ GUARDAR COMO JSON
# ===============================
print("\n💾 Guardando archivo JSON...")

output_file = 'modelo_riesgo.json'
with open(output_file, 'w') as f:
    json.dump(model_data, f, indent=2)

# Calcular tamaño del archivo
import os
file_size = os.path.getsize(output_file)

print("\n" + "=" * 50)
print("✅ CONVERSIÓN EXITOSA!")
print("=" * 50)
print(f"📄 Archivo: {output_file}")
print(f"📊 Tamaño: {file_size / 1024:.2f} KB ({file_size / (1024*1024):.2f} MB)")
print(f"🌲 Árboles: {model_data['n_estimators']}")
print(f"🔢 Características: {model_data['n_features']}")
print(f"🎯 Clases: {model_data['classes']}")
print("\n📋 Próximos pasos:")
print("   1. Copia 'modelo_riesgo.json' a 'src/assets/' en tu proyecto Angular")
print("   2. Copia 'dataset_ml_final.csv' a 'src/assets/' (si lo necesitas)")
print("   3. Ejecuta: ng serve")
print("=" * 50)

# ===============================
# 5️⃣ VALIDAR EL MODELO (OPCIONAL)
# ===============================
print("\n🧪 Validando modelo convertido...")

# Hacer una predicción de prueba
test_input = [[520, 7]]  # Ejemplo: MQ7 alto
prediction = model.predict(test_input)[0]
probability = model.predict_proba(test_input)[0][1]

print(f"✓ Predicción de prueba:")
print(f"   Input: {test_input[0]}")
print(f"   Predicción: {'RIESGO' if prediction == 1 else 'NORMAL'}")
print(f"   Probabilidad: {probability * 100:.2f}%")
print("\nℹ️  Usa estos valores para probar en Angular\n")