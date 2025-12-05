"""
Script para simular lecturas de sensores cada 4 segundos
Genera valores aleatorios que pueden disparar alertas o estar en rango normal
"""
import requests
import time
import random
from datetime import datetime

# Configuración
API_BASE_URL = "https://mineguard-api-staging-fxhyfyanhacjf7g5.mexicocentral-01.azurewebsites.net"
USERS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
INTERVAL_SECONDS = 11

# Credenciales para autenticación (ajusta según tu usuario)
LOGIN_EMPLOYEE_NUMBER = "0322103782"
LOGIN_PASSWORD = "12345678"

def login():
    """Obtiene el token de autenticación"""
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "employee_number": LOGIN_EMPLOYEE_NUMBER,
        "password": LOGIN_PASSWORD
    }
    
    response = requests.post(
        f"{API_BASE_URL}/auth/login",
        json=payload,
        headers=headers
    )
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"Autenticación exitosa")
        return token
    else:
        print(f"Error en login: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def generate_reading_data(user_id):
    """Genera datos de lectura aleatorios con posibilidad de alertas"""
    
    # Probabilidad de generar valores que disparen alertas (10%)
    trigger_alert = random.random() < 0.1
    
    if trigger_alert:
        alert_type = random.choice(['heart_rate', 'co'])
        
        if alert_type == 'heart_rate':
            # Ritmo cardíaco alto (>140) o bajo (<45)
            if random.random() < 0.5:
                pulse = random.randint(145, 180)  # Alto
            else:
                pulse = random.randint(35, 44)  # Bajo
        else:  # CO
            # CO elevado (>100 ppm crítico, >50 ppm warning)
            mq7 = random.uniform(55, 150)
    else:
        # Valores normales
        alert_type = None
    
    # Generar valores base (normales si no hay alerta específica)
    data = {
        "user_id": user_id,
        "device_id": user_id,  # Asumiendo que device_id == user_id
        "pulse": random.randint(60, 100) if alert_type != 'heart_rate' else pulse,
        "mq7": round(random.uniform(10, 40), 2) if alert_type != 'co' else round(mq7, 2),
        # Acelerómetro (valores normales de reposo/movimiento leve)
        "ax": round(random.uniform(-2.0, 2.0), 6),
        "ay": round(random.uniform(-2.0, 2.0), 6),
        "az": round(random.uniform(8.0, 12.0), 6),  # Gravedad en Z
        # Giroscopio (valores normales en radianes/segundo)
        "gx": round(random.uniform(-0.05, 0.05), 6),
        "gy": round(random.uniform(-0.05, 0.05), 6),
        "gz": round(random.uniform(-0.05, 0.05), 6)
    }
    
    return data, alert_type

def send_reading(token, user_id):
    """Envía una lectura al endpoint"""
    reading_data, alert_type = generate_reading_data(user_id)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{API_BASE_URL}/readings/",
        json=reading_data,
        headers=headers
    )
    
    timestamp = datetime.now().strftime("%H:%M:%S")
    alert_icon = "🚨" if alert_type else "✓"
    alert_info = f" [{alert_type.upper()}]" if alert_type else ""
    
    if response.status_code in [200, 201]:
        print(f"{alert_icon} {timestamp} - User {user_id}: "
              f"HR={reading_data['pulse']}bpm, CO={reading_data['mq7']}ppm{alert_info}")
        return True
    else:
        print(f"✗ {timestamp} - User {user_id}: Error {response.status_code} - {response.text}")
        return False

def main():
    """Función principal del simulador"""
    print("=" * 80)
    print("🔄 SIMULADOR DE LECTURAS DE SENSORES")
    print("=" * 80)
    print("📍 API: {API_BASE_URL}")
    print(f"👥 Usuarios: {USERS}")
    print(f"⏱️  Intervalo: {INTERVAL_SECONDS} segundos")
    print(f"🎯 Probabilidad de alerta: ~10%")
    print("=" * 80)
    print()
    
    # Autenticación
    token = login()
    if not token:
        print("❌ No se pudo autenticar. Verifica las credenciales.")
        return
    
    print(f"\n🚀 Iniciando simulación... (Presiona Ctrl+C para detener)\n")
    
    try:
        iteration = 0
        while True:
            iteration += 1
            print(f"\n--- Iteración #{iteration} ---")
            
            # Enviar lectura para cada usuario
            for user_id in USERS:
                send_reading(token, user_id)
                time.sleep(0.5)  # Pequeña pausa entre usuarios
            
            # Esperar el intervalo antes de la siguiente ronda
            time.sleep(INTERVAL_SECONDS - (len(USERS) * 0.5))
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Simulación detenida por el usuario")
        print(f"📊 Total de iteraciones: {iteration}")
        print("=" * 80)

if __name__ == "__main__":
    main()
