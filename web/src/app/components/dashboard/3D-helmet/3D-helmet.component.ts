import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HelmetService, ReadingData } from './3D-helmet.service';

export interface GyroscopeData {
  pitch: number;
  roll: number;
  yaw: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  totalAccel: number;
  timestamp: Date;
}

export interface SafetyStatus {
  status: 'normal' | 'warning' | 'danger';
  color: string;
  icon: string;
}

@Component({
  selector: 'app-gyroscope-orientation',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, TranslateModule],
  templateUrl: './3D-helmet.component.html',
  styleUrls: ['./3D-helmet.component.scss']
})
export class GyroscopeOrientationComponent implements OnInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  public gyroData: GyroscopeData | null = null;

  public safetyStatus: SafetyStatus = {
    status: 'normal',
    color: '#10b981',
    icon: 'check_circle'
  };

  public manualMode = false;
  public pitchControl = 0;
  public rollControl = 0;
  public yawControl = 0;

  private THREE: any;
  private scene: any;
  private camera: any;
  private renderer: any;
  private helmetModel: any;
  private controls: any;
  private animationFrameId?: number;

  private autoSubscription?: Subscription;
  private time = 0;
  private lastRenderTime = 0;
  private dataSubscription?: Subscription;

  public readonly PITCH_THRESHOLD = 60;
  public readonly ROLL_THRESHOLD = 60;
  public readonly FALL_THRESHOLD = 75;
  public readonly ACCEL_WARNING = 2.0;
  public readonly ACCEL_DANGER = 2.5;

  constructor(
    public translate: TranslateService,
    private helmetService: HelmetService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadThreeJS();
    this.init3DScene();
    this.loadHelmetModel();
    this.startAutoMode();
    this.animate();
  }

  ngOnDestroy(): void {
    this.stopAutoMode();
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
  }

  async loadThreeJS(): Promise<void> {
    this.THREE = await import('three');
    const controlsModule = await import('three/examples/jsm/controls/OrbitControls');
    this.THREE.OrbitControls = controlsModule.OrbitControls;
  }

  init3DScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    this.scene = new this.THREE.Scene();
    this.scene.background = null;

    this.camera = new this.THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 6);

    this.renderer = new this.THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    });

    const ratio = window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio;
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = this.THREE.sRGBEncoding;
    this.renderer.toneMapping = this.THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    const ambient = new this.THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    const hemiLight = new this.THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 3, 0);
    this.scene.add(hemiLight);

    const dirLight = new this.THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    const rimLight = new this.THREE.DirectionalLight(0x667eea, 0.8);
    rimLight.position.set(-6, 8, -6);
    this.scene.add(rimLight);

    const fillLight = new this.THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(0, 3, 6);
    this.scene.add(fillLight);

    this.controls = new this.THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.6;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.5;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 10;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  async loadHelmetModel(): Promise<void> {
    try {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
      const loader = new GLTFLoader();

      loader.load(
        '../../../assets/models/casco2.glb',
        (gltf: any) => {
          this.helmetModel = gltf.scene;
          this.helmetModel.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          this.helmetModel.scale.set(13, 13, 13);
          this.helmetModel.position.set(0, -0.55, 0);
          this.scene.add(this.helmetModel);
        },
        undefined,
        () => this.createFallbackModel()
      );
    } catch {
      this.createFallbackModel();
    }
  }

  createFallbackModel(): void {
    const geo = new this.THREE.BoxGeometry(1.5, 1, 1);
    const mat = new this.THREE.MeshStandardMaterial({
      color: 0xff6600,
      metalness: 0.4,
      roughness: 0.4
    });

    const mesh = new this.THREE.Mesh(geo, mat);
    this.helmetModel = new this.THREE.Group();
    this.helmetModel.add(mesh);
    this.scene.add(this.helmetModel);
  }

  animate(time: number = 0): void {
    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

    const delta = time - this.lastRenderTime;
    if (delta < 1000 / 45) return;
    this.lastRenderTime = time;

    if (this.controls) this.controls.update();
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  startAutoMode(): void {
    this.manualMode = false;
    
    // Suscribirse a las lecturas reales cada 2 segundos
    this.dataSubscription = this.helmetService.getMyLatestReadingPolling(2000).subscribe({
      next: (data: ReadingData) => {
        this.updateFromRealData(data);
        this.updateHelmetOrientation();
        this.updateSafetyStatus();
      },
      error: (err) => {
        console.error('Error al obtener lecturas:', err);
        // Simulación desactivada - solo datos reales
        // this.startSimulationFallback();
      }
    });
  }

  startSimulationFallback(): void {
    // Fallback: usar datos simulados si falla la API
    this.autoSubscription = interval(100).subscribe(() => {
      this.simulateMPU6050Data();
      this.updateHelmetOrientation();
      this.updateSafetyStatus();
    });
  }

  stopAutoMode(): void {
    if (this.autoSubscription) this.autoSubscription.unsubscribe();
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  updateFromRealData(data: ReadingData): void {
    // Convertir giroscopio (rad/s) a grados
    const pitch = data.gy ? data.gy * (180 / Math.PI) * 10 : 0;  // Multiplicado para más movimiento visible
    const roll = data.gx ? data.gx * (180 / Math.PI) * 10 : 0;
    const yaw = data.gz ? data.gz * (180 / Math.PI) * 10 : 0;

    // Calcular aceleración total en g (donde 9.8 m/s² = 1g)
    const ax = data.ax || 0;
    const ay = data.ay || 0;
    const az = data.az || 9.8; // Default a gravedad si no hay datos
    const totalAccel = Math.sqrt(ax * ax + ay * ay + az * az) / 9.8;

    this.gyroData = {
      pitch,
      roll,
      yaw,
      accelX: ax / 9.8,
      accelY: ay / 9.8,
      accelZ: az / 9.8,
      totalAccel: Number(totalAccel.toFixed(2)),
      timestamp: new Date(data.timestamp)
    };
  }

  simulateMPU6050Data(): void {
    this.time += 0.05;

    const pitch = Math.sin(this.time) * 30 + (Math.random() - 0.5) * 10;
    const roll = Math.cos(this.time * 0.7) * 25 + (Math.random() - 0.5) * 8;
    const yaw = Math.sin(this.time * 0.5) * 50 + (Math.random() - 0.5) * 15;
    const accel = 1 + (Math.abs(pitch) + Math.abs(roll)) / 90 * 1.5;

    this.gyroData = {
      pitch, roll, yaw,
      accelX: Math.sin(pitch) * accel,
      accelY: Math.sin(roll) * accel,
      accelZ: Math.cos(pitch) * Math.cos(roll) * accel,
      totalAccel: Number(accel.toFixed(2)),
      timestamp: new Date()
    };
  }

  updateHelmetOrientation(): void {
    if (!this.helmetModel) return;
    if (!this.gyroData && !this.manualMode) return; // No actualizar sin datos

    const { pitch, roll, yaw } = this.manualMode
      ? { pitch: this.pitchControl, roll: this.rollControl, yaw: this.yawControl }
      : this.gyroData!;

    this.helmetModel.rotation.x = this.THREE.MathUtils.degToRad(-pitch);
    this.helmetModel.rotation.y = this.THREE.MathUtils.degToRad(yaw);
    this.helmetModel.rotation.z = this.THREE.MathUtils.degToRad(-roll);
  }

  updateSafetyStatus(): void {
    if (!this.gyroData) return; // No actualizar sin datos
    const { pitch, roll, totalAccel } = this.gyroData;
    const maxA = Math.max(Math.abs(pitch), Math.abs(roll));

    if (maxA > this.FALL_THRESHOLD || totalAccel > this.ACCEL_DANGER) {
      this.safetyStatus = { 
        status: 'danger', 
        color: '#ef4444', 
        icon: 'warning' 
      };
    } else if (maxA > this.PITCH_THRESHOLD || totalAccel > this.ACCEL_WARNING) {
      this.safetyStatus = { 
        status: 'warning', 
        color: '#f59e0b', 
        icon: 'error_outline' 
      };
    } else {
      this.safetyStatus = { 
        status: 'normal', 
        color: '#10b981', 
        icon: 'check_circle' 
      };
    }
  }

  toggleManualMode(): void {
    if (this.manualMode) {
      // Volver a modo automático con datos reales
      this.startAutoMode();
    } else {
      // Cambiar a modo manual
      this.stopAutoMode();
      this.manualMode = true;
      this.pitchControl = this.gyroData?.pitch || 0;
      this.rollControl = this.gyroData?.roll || 0;
      this.yawControl = this.gyroData?.yaw || 0;
    }
  }

  onManualChange(): void {
    if (!this.manualMode) return;
    this.gyroData = {
      pitch: this.pitchControl,
      roll: this.rollControl,
      yaw: this.yawControl,
      accelX: this.gyroData?.accelX || 0,
      accelY: this.gyroData?.accelY || 0,
      accelZ: this.gyroData?.accelZ || 1,
      totalAccel: this.gyroData?.totalAccel || 1.0,
      timestamp: new Date()
    };
    this.updateHelmetOrientation();
    this.updateSafetyStatus();
  }

  resetOrientation(): void {
    this.pitchControl = 0;
    this.rollControl = 0;
    this.yawControl = 0;
    this.onManualChange();
  }

  getHelmetGlow(): string {
    return {
      normal: '0 0 15px #10b981',
      warning: '0 0 20px #f59e0b',
      danger: '0 0 30px #ef4444'
    }[this.safetyStatus.status];
  }
}