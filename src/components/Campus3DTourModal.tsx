import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  X,
  Maximize2,
  Minimize2,
  Compass,
  Sun,
  Sunset,
  Moon,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building,
  GraduationCap,
  Sparkles,
  Info,
  Clock,
  User,
  ShieldCheck,
  RotateCw,
  Eye
} from 'lucide-react';
import { CAMPUS_3D_HOTSPOTS, CHILIMO_INFO } from '../data/mockData';
import { Campus3DHotspot } from '../types';

interface Campus3DTourModalProps {
  onClose: () => void;
  defaultHotspotId?: string;
}

type TimeOfDay = 'day' | 'sunset' | 'night';

export const Campus3DTourModal: React.FC<Campus3DTourModalProps> = ({
  onClose,
  defaultHotspotId = 'overview'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [activeHotspotId, setActiveHotspotId] = useState<string>(defaultHotspotId);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedBuildingInfo, setSelectedBuildingInfo] = useState<Campus3DHotspot | null>(
    CAMPUS_3D_HOTSPOTS.find(h => h.id === defaultHotspotId) || null
  );

  // Mutable refs for Three.js scene loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
    ambient: THREE.AmbientLight;
    nightWindowMaterials: THREE.MeshStandardMaterial[];
    nightFloodlights: THREE.SpotLight[];
  } | null>(null);

  // Target camera state for damped transitions
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 42, 65));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));
  const isTransitioning = useRef<boolean>(false);

  const activeHotspot = useMemo(() => {
    return CAMPUS_3D_HOTSPOTS.find(h => h.id === activeHotspotId) || CAMPUS_3D_HOTSPOTS[0];
  }, [activeHotspotId]);

  // Handle switching hotspots with camera damping
  const handleSelectHotspot = (hotspot: Campus3DHotspot) => {
    setActiveHotspotId(hotspot.id);
    setSelectedBuildingInfo(hotspot);
    targetCamPos.current.set(...hotspot.cameraPosition);
    targetLookAt.current.set(...hotspot.cameraTarget);
    isTransitioning.current = true;
    setAutoRotate(false);
  };

  // Toggle Time of Day in the 3D scene
  useEffect(() => {
    if (!sceneRef.current || !lightsRef.current || !rendererRef.current) return;
    const { dirLight, hemiLight, ambient, nightWindowMaterials, nightFloodlights } = lightsRef.current;
    const scene = sceneRef.current;

    if (timeOfDay === 'day') {
      scene.background = new THREE.Color(0xa0d8ef); // Sunny Blue Sky
      if (scene.fog) scene.fog.color = new THREE.Color(0xa0d8ef);
      dirLight.color.setHex(0xfff7e6);
      dirLight.intensity = 2.4;
      dirLight.position.set(30, 45, 25);
      hemiLight.color.setHex(0xe8f4f8);
      hemiLight.groundColor.setHex(0x385d38);
      hemiLight.intensity = 1.0;
      ambient.intensity = 0.6;
      nightWindowMaterials.forEach(m => {
        m.emissive.setHex(0x000000);
      });
      nightFloodlights.forEach(l => {
        l.intensity = 0;
      });
    } else if (timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0xd97736); // Golden Warm Sunset
      if (scene.fog) scene.fog.color = new THREE.Color(0xd97736);
      dirLight.color.setHex(0xff7733);
      dirLight.intensity = 1.8;
      dirLight.position.set(45, 18, 35);
      hemiLight.color.setHex(0xffaa66);
      hemiLight.groundColor.setHex(0x442211);
      hemiLight.intensity = 0.8;
      ambient.intensity = 0.5;
      nightWindowMaterials.forEach(m => {
        m.emissive.setHex(0x332211);
      });
      nightFloodlights.forEach(l => {
        l.intensity = 0.5;
      });
    } else {
      // Night
      scene.background = new THREE.Color(0x060c18); // Midnight Navy
      if (scene.fog) scene.fog.color = new THREE.Color(0x060c18);
      dirLight.color.setHex(0x6688cc);
      dirLight.intensity = 0.4;
      dirLight.position.set(-20, 30, -20);
      hemiLight.color.setHex(0x1a2638);
      hemiLight.groundColor.setHex(0x05080f);
      hemiLight.intensity = 0.3;
      ambient.intensity = 0.25;
      nightWindowMaterials.forEach(m => {
        m.emissive.setHex(0xffd577);
      });
      nightFloodlights.forEach(l => {
        l.intensity = 4.0;
      });
    }
  }, [timeOfDay]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js constitution
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0d8ef);
    scene.fog = new THREE.FogExp2(0xa0d8ef, 0.0075);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      350
    );
    camera.position.set(0, 42, 65);
    cameraRef.current = camera;

    // 3. Renderer with PBR settings
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Map (PMREMGenerator + RoomEnvironment)
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // Fallback
    }

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Do not go under ground
    controls.minDistance = 8;
    controls.maxDistance = 110;
    controls.target.set(0, 5, 0);
    controlsRef.current = controls;

    // Interrupt scripted camera damping if user manually moves orbit controls
    controls.addEventListener('start', () => {
      isTransitioning.current = false;
    });

    // 6. Lighting Rig
    const dirLight = new THREE.DirectionalLight(0xfff7e6, 2.4);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 120;
    const d = 55;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xe8f4f8, 0x385d38, 1.0);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const nightWindowMaterials: THREE.MeshStandardMaterial[] = [];
    const nightFloodlights: THREE.SpotLight[] = [];

    lightsRef.current = {
      dirLight,
      hemiLight,
      ambient,
      nightWindowMaterials,
      nightFloodlights
    };

    // ========================================================
    // PROCEDURAL 3D ASSETS: CHILIMO ACADEMY CAMPUS (THREE.Group)
    // ========================================================

    // Helpers: Procedural Canvas Textures (Zero 404 dependencies)
    const createGrassTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#4c8c4a';
      ctx.fillRect(0, 0, 256, 256);
      // Subtle grass fibers
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#579d55' : '#3d773b';
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 3);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(16, 16);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const createCobblestoneTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#a69f92';
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = '#787063';
      ctx.lineWidth = 2;
      for (let x = 0; x <= 128; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 128);
        ctx.stroke();
      }
      for (let y = 0; y <= 128; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(128, y);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 24);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // A. Main Campus Terrain
    const terrainGroup = new THREE.Group();
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      map: createGrassTexture(),
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !isSoftwareGl;
    terrainGroup.add(ground);

    // Main Paved Central Walkway
    const walkwayGeo = new THREE.PlaneGeometry(8, 55);
    const walkwayMat = new THREE.MeshStandardMaterial({
      map: createCobblestoneTexture(),
      roughness: 0.8,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.set(0, 0.02, 6);
    walkway.receiveShadow = !isSoftwareGl;
    terrainGroup.add(walkway);

    // Cross Pathway connecting Blocks A & B
    const crossWalkwayGeo = new THREE.PlaneGeometry(48, 6);
    const crossWalkway = new THREE.Mesh(crossWalkwayGeo, walkwayMat);
    crossWalkway.rotation.x = -Math.PI / 2;
    crossWalkway.position.set(0, 0.025, 6);
    terrainGroup.add(crossWalkway);

    scene.add(terrainGroup);

    // B. Reusable Window Material (with night glow emission)
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x223344,
      roughness: 0.2,
      metalness: 0.8
    });
    nightWindowMaterials.push(windowMat);

    // C. Building 1: ACADEMIC BLOCK A (Composite 3–12 part Group)
    const blockAGroup = new THREE.Group();
    blockAGroup.position.set(-18, 0, -2);

    // Foundation
    const bAFoundation = new THREE.Mesh(
      new THREE.BoxGeometry(18, 1, 14),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 })
    );
    bAFoundation.position.y = 0.5;
    bAFoundation.castShadow = !isSoftwareGl;
    bAFoundation.receiveShadow = !isSoftwareGl;
    blockAGroup.add(bAFoundation);

    // 2-Story Main Walls (Burayu Sandstone color)
    const bAWalls = new THREE.Mesh(
      new THREE.BoxGeometry(17, 8, 13),
      new THREE.MeshStandardMaterial({ color: 0xf3ede2, roughness: 0.6 })
    );
    bAWalls.position.y = 5;
    bAWalls.castShadow = !isSoftwareGl;
    bAWalls.receiveShadow = !isSoftwareGl;
    blockAGroup.add(bAWalls);

    // Angled Terracotta Roof
    const bARoof = new THREE.Mesh(
      new THREE.ConeGeometry(13.5, 3.5, 4),
      new THREE.MeshStandardMaterial({ color: 0xb84b2c, roughness: 0.5 })
    );
    bARoof.position.y = 10.75;
    bARoof.rotation.y = Math.PI / 4;
    bARoof.scale.set(1.1, 1, 0.9);
    bARoof.castShadow = !isSoftwareGl;
    blockAGroup.add(bARoof);

    // Entrance Portico with columns
    const porticoRoof = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.6, 3),
      new THREE.MeshStandardMaterial({ color: 0xb84b2c, roughness: 0.5 })
    );
    porticoRoof.position.set(0, 5, 7.5);
    blockAGroup.add(porticoRoof);

    const col1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    col1.position.set(-2, 2.5, 8.5);
    const col2 = col1.clone();
    col2.position.set(2, 2.5, 8.5);
    blockAGroup.add(col1, col2);

    // Recessed Classroom Windows (Front side)
    for (let f = 0; f < 2; f++) {
      for (let w = -3; w <= 3; w++) {
        if (f === 0 && Math.abs(w) <= 1) continue; // door gap
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.2), windowMat);
        win.position.set(w * 2.2, 3.2 + f * 3.4, 6.55);
        blockAGroup.add(win);
      }
    }

    // Signboard banner: "BLOCK A - KUTAA 1-8"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 64;
    const sCtx = signCanvas.getContext('2d')!;
    sCtx.fillStyle = '#0f1e36';
    sCtx.fillRect(0, 0, 256, 64);
    sCtx.fillStyle = '#ffd577';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('BLOCK A • KUTAA 1-8', 128, 40);
    const signTex = new THREE.CanvasTexture(signCanvas);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const bASign = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1, 0.2),
      new THREE.MeshStandardMaterial({ map: signTex })
    );
    bASign.position.set(0, 6, 7.6);
    blockAGroup.add(bASign);

    scene.add(blockAGroup);

    // D. Building 2: SCIENCE & ICT COMPLEX (Block B)
    const scienceGroup = new THREE.Group();
    scienceGroup.position.set(18, 0, -2);

    const sciFound = bAFoundation.clone();
    const sciWalls = new THREE.Mesh(
      new THREE.BoxGeometry(17, 8, 13),
      new THREE.MeshStandardMaterial({ color: 0xe0e7ef, roughness: 0.4, metalness: 0.1 })
    );
    sciWalls.position.y = 5;
    sciWalls.castShadow = !isSoftwareGl;
    sciWalls.receiveShadow = !isSoftwareGl;
    scienceGroup.add(sciFound, sciWalls);

    // Modern Flat Roof with Perimeter Parapet
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(17.4, 0.8, 13.4),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
    );
    parapet.position.y = 9.4;
    scienceGroup.add(parapet);

    // Glass Atrium Dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.2
      })
    );
    dome.position.set(0, 9.4, 0);
    scienceGroup.add(dome);

    // Solar Panel Arrays on roof
    for (let sp = -1; sp <= 1; sp += 2) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.15, 3),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.2 })
      );
      panel.position.set(sp * 5, 9.7, 0);
      panel.rotation.x = 0.2;
      scienceGroup.add(panel);
    }

    // Windows & Lab vents
    for (let f = 0; f < 2; f++) {
      for (let w = -3; w <= 3; w++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.2), windowMat);
        win.position.set(w * 2.2, 3.2 + f * 3.4, 6.55);
        scienceGroup.add(win);
      }
    }

    // Signboard: "STEM & ICT LAB"
    const sciSignCanvas = document.createElement('canvas');
    sciSignCanvas.width = 256;
    sciSignCanvas.height = 64;
    const sciCtx = sciSignCanvas.getContext('2d')!;
    sciCtx.fillStyle = '#065f46';
    sciCtx.fillRect(0, 0, 256, 64);
    sciCtx.fillStyle = '#6ee7b7';
    sciCtx.font = 'bold 22px sans-serif';
    sciCtx.textAlign = 'center';
    sciCtx.fillText('STEM & ICT LAB 🔬', 128, 40);
    const sciSignTex = new THREE.CanvasTexture(sciSignCanvas);
    sciSignTex.colorSpace = THREE.SRGBColorSpace;
    const sciSign = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1, 0.2),
      new THREE.MeshStandardMaterial({ map: sciSignTex })
    );
    sciSign.position.set(0, 6, 6.7);
    scienceGroup.add(sciSign);

    scene.add(scienceGroup);

    // E. Building 3: CENTRAL LIBRARY (Classical Portico & Reading Hall)
    const libGroup = new THREE.Group();
    libGroup.position.set(0, 0, -26);

    const libBase = new THREE.Mesh(
      new THREE.BoxGeometry(22, 1.2, 14),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 })
    );
    libBase.position.y = 0.6;
    libGroup.add(libBase);

    const libWalls = new THREE.Mesh(
      new THREE.BoxGeometry(20, 7.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.5 })
    );
    libWalls.position.y = 5;
    libWalls.castShadow = !isSoftwareGl;
    libGroup.add(libWalls);

    // Classical Columns in Front of Library
    for (let c = -3; c <= 3; c += 2) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 6.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      col.position.set(c * 2.5, 4.4, 6.8);
      col.castShadow = !isSoftwareGl;
      libGroup.add(col);
    }

    // Pediment (Triangle gable)
    const pedimentGeo = new THREE.ConeGeometry(9, 2.5, 4);
    const pediment = new THREE.Mesh(
      pedimentGeo,
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 })
    );
    pediment.position.set(0, 9.8, 6.5);
    pediment.rotation.y = Math.PI / 4;
    pediment.scale.set(1.3, 1, 0.5);
    libGroup.add(pediment);

    // Large Library Windows
    for (let lw = -2; lw <= 2; lw++) {
      const lWin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.5, 0.2), windowMat);
      lWin.position.set(lw * 3.5, 5, 6.1);
      libGroup.add(lWin);
    }

    // Open Book Monument on lawn
    const monument = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    monument.position.set(0, 1.2, 9.5);
    monument.rotation.x = 0.5;
    libGroup.add(monument);

    scene.add(libGroup);

    // F. Building 4: MAIN CAMPUS GATE & SECURITY BOOTH
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 28);

    // Left and Right Stone Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), pillarMat);
    pLeft.position.set(-6, 3, 0);
    pLeft.castShadow = !isSoftwareGl;
    const pRight = pLeft.clone();
    pRight.position.set(6, 3, 0);
    gateGroup.add(pLeft, pRight);

    // Archway connecting pillars
    const arch = new THREE.Mesh(new THREE.BoxGeometry(14, 1.4, 2.2), pillarMat);
    arch.position.set(0, 6.7, 0);
    arch.castShadow = !isSoftwareGl;
    gateGroup.add(arch);

    // Banner: "CHILIMO ACADEMY - BURAYU"
    const gateCanvas = document.createElement('canvas');
    gateCanvas.width = 512;
    gateCanvas.height = 96;
    const gCtx = gateCanvas.getContext('2d')!;
    gCtx.fillStyle = '#0f1e36';
    gCtx.fillRect(0, 0, 512, 96);
    gCtx.fillStyle = '#f59e0b';
    gCtx.font = 'bold 32px serif';
    gCtx.textAlign = 'center';
    gCtx.fillText('★ CHILIMO ACADEMY • BURAYU ★', 256, 58);
    const gateTex = new THREE.CanvasTexture(gateCanvas);
    gateTex.colorSpace = THREE.SRGBColorSpace;
    const gateBanner = new THREE.Mesh(
      new THREE.BoxGeometry(11, 1.5, 0.3),
      new THREE.MeshStandardMaterial({ map: gateTex })
    );
    gateBanner.position.set(0, 7.8, 0);
    gateGroup.add(gateBanner);

    // Security Gate Barrier bar (Red-White striped)
    const barrier = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 9, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
    );
    barrier.rotation.z = Math.PI / 2;
    barrier.position.set(0, 1.1, 0);
    gateGroup.add(barrier);

    // Security Cabin Booth
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 3.2, 3),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    );
    cabin.position.set(9.5, 1.6, 0);
    cabin.castShadow = !isSoftwareGl;
    gateGroup.add(cabin);

    scene.add(gateGroup);

    // G. SPORTS STADIUM & RUNNING TRACK (Left side of campus)
    const sportsGroup = new THREE.Group();
    sportsGroup.position.set(-36, 0.03, -24);

    // Football Pitch Turf
    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(28, 42),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 })
    );
    pitch.rotation.x = -Math.PI / 2;
    sportsGroup.add(pitch);

    // Chalk Pitch Boundary and Center Circle
    const pLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cCircle = new THREE.Mesh(new THREE.RingGeometry(3.5, 3.7, 32), pLineMat);
    cCircle.rotation.x = -Math.PI / 2;
    cCircle.position.y = 0.01;
    sportsGroup.add(cCircle);

    // Goalposts (North and South)
    const createGoalpost = (zPos: number) => {
      const g = new THREE.Group();
      g.position.set(0, 0, zPos);
      const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2), postMat);
      p1.position.set(-3, 1.1, 0);
      const p2 = p1.clone();
      p2.position.set(3, 1.1, 0);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6), postMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 2.2, 0);
      g.add(p1, p2, bar);
      return g;
    };
    sportsGroup.add(createGoalpost(-20), createGoalpost(20));

    // Terracotta Running Track (Oval surrounding pitch)
    const trackMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
    const track = new THREE.Mesh(new THREE.PlaneGeometry(36, 50), trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.y = -0.01;
    sportsGroup.add(track);

    // Spectator Bleachers
    for (let r = 0; r < 3; r++) {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5 + r * 0.4, 24),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 })
      );
      bench.position.set(17 + r * 1.5, (0.5 + r * 0.4) / 2, 0);
      sportsGroup.add(bench);
    }

    // 4 Floodlight Masts
    const lightPositions: [number, number][] = [
      [-16, -23], [16, -23], [-16, 23], [16, 23]
    ];
    lightPositions.forEach(([lx, lz]) => {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 14, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
      );
      mast.position.set(lx, 7, lz);
      sportsGroup.add(mast);

      // Night spotlight
      const spot = new THREE.SpotLight(0xffffff, 0, 45, Math.PI / 4, 0.5);
      spot.position.set(lx, 14, lz);
      spot.target.position.set(0, 0, 0);
      sportsGroup.add(spot);
      sportsGroup.add(spot.target);
      nightFloodlights.push(spot);
    });

    scene.add(sportsGroup);

    // H. SCHOOL BUS FLEET TERMINAL (Right side of campus)
    const busGroup = new THREE.Group();
    busGroup.position.set(32, 0, -22);

    // Bus Parking Asphalt Pad
    const asphalt = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 28),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 })
    );
    asphalt.rotation.x = -Math.PI / 2;
    busGroup.add(asphalt);

    // Yellow School Buses (Composite 8-part procedural bus model)
    const createSchoolBus = (xOff: number, zOff: number, label: string) => {
      const bus = new THREE.Group();
      bus.position.set(xOff, 0, zOff);

      // Yellow Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 9),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.2 })
      );
      body.position.y = 2.2;
      body.castShadow = !isSoftwareGl;
      bus.add(body);

      // Black Window Strip
      const winStrip = new THREE.Mesh(
        new THREE.BoxGeometry(4.05, 1, 7.5),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 })
      );
      winStrip.position.set(0, 2.7, 0);
      bus.add(winStrip);

      // White Roof
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(3.9, 0.3, 8.8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
      );
      roof.position.set(0, 3.8, 0);
      bus.add(roof);

      // Wheels (4 Black rubber wheels with silver hub)
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
      const wheelPositions: [number, number, number][] = [
        [-2.05, 0.7, 2.6], [2.05, 0.7, 2.6],
        [-2.05, 0.7, -2.6], [2.05, 0.7, -2.6]
      ];
      wheelPositions.forEach(([wx, wy, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16), wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, wy, wz);
        bus.add(w);
      });

      // Front Headlights
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
      h1.position.set(-1.2, 1.6, 4.55);
      const h2 = h1.clone();
      h2.position.set(1.2, 1.6, 4.55);
      bus.add(h1, h2);

      return bus;
    };

    busGroup.add(createSchoolBus(-5, 0, "BUS 01"));
    busGroup.add(createSchoolBus(5, 0, "BUS 02"));
    scene.add(busGroup);

    // I. ETHIOPIAN & OROMIA FLAG POLE IN FRONT PLAZA
    const flagGroup = new THREE.Group();
    flagGroup.position.set(0, 0, 10);

    const flagBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.2, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 })
    );
    flagBase.position.y = 0.3;
    flagGroup.add(flagBase);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 10, 12),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 })
    );
    pole.position.y = 5.3;
    flagGroup.add(pole);

    // Procedural Ethiopian & Oromia flag banner
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 128;
    flagCanvas.height = 80;
    const fCtx = flagCanvas.getContext('2d')!;
    // Green, Yellow, Red tricolor
    fCtx.fillStyle = '#15803d';
    fCtx.fillRect(0, 0, 128, 27);
    fCtx.fillStyle = '#facc15';
    fCtx.fillRect(0, 27, 128, 26);
    fCtx.fillStyle = '#dc2626';
    fCtx.fillRect(0, 53, 128, 27);
    const flagTex = new THREE.CanvasTexture(flagCanvas);
    flagTex.colorSpace = THREE.SRGBColorSpace;
    const flagMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.5),
      new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide })
    );
    flagMesh.position.set(1.25, 9.4, 0);
    flagGroup.add(flagMesh);

    scene.add(flagGroup);

    // J. ACACIA & EUCALYPTUS TREES (Procedural 3-layer foliage)
    const treeGroup = new THREE.Group();
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });
    const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x2e6930, roughness: 0.7 });
    const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x3d8540, roughness: 0.65 });

    const createAcaciaTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      tree.scale.set(scale, scale, scale);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 4.5, 8), treeTrunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = !isSoftwareGl;
      tree.add(trunk);

      // Layered canopy
      const f1 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.5, 1.2, 8), foliageMat1);
      f1.position.y = 4.8;
      f1.castShadow = !isSoftwareGl;
      const f2 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 1.0, 8), foliageMat2);
      f2.position.y = 5.8;
      f2.castShadow = !isSoftwareGl;
      tree.add(f1, f2);

      return tree;
    };

    // Perimeter grove & campus avenues
    const treeCoords = [
      [-55, 15], [-58, 0], [-55, -15], [-50, -35], [-45, 30],
      [55, 15], [58, 0], [55, -15], [50, -35], [45, 30],
      [-10, 18], [10, 18], [-10, -10], [10, -10],
      [-28, 20], [28, 20], [-28, -12], [28, -12],
      [-30, -45], [0, -48], [30, -48]
    ];
    treeCoords.forEach(([tx, tz], i) => {
      const s = 0.8 + ((i % 5) * 0.1);
      treeGroup.add(createAcaciaTree(tx, tz, s));
    });
    scene.add(treeGroup);

    // K. Animation / Render Loop with Damped Camera Transitions
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();

      // Damped camera transition when user chooses a hotspot
      if (isTransitioning.current) {
        camera.position.lerp(targetCamPos.current, 0.05);
        controls.target.lerp(targetLookAt.current, 0.05);

        if (
          camera.position.distanceTo(targetCamPos.current) < 0.2 &&
          controls.target.distanceTo(targetLookAt.current) < 0.2
        ) {
          isTransitioning.current = false;
        }
      }

      // Gentle flag flutter
      flagMesh.rotation.y = Math.sin(clock.getElapsedTime() * 3) * 0.12;

      // Auto-rotation when idle
      if (autoRotate && !isTransitioning.current) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
      } else {
        controls.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden ${isFullscreen ? 'p-0' : 'p-2 sm:p-5'}`}>
      <div className={`bg-slate-900 border border-slate-700 w-full flex flex-col overflow-hidden relative shadow-2xl ${isFullscreen ? 'h-full rounded-none' : 'max-w-7xl h-[92vh] rounded-3xl'}`}>

        {/* TOP BAR: BRANDING, TITLE & VIEWPORT CONTROLS */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          
          {/* School Badge & Mode Title */}
          <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-xl text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                  Daawwannaa 3D Akkaadaamii Cillimoo
                </h2>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Interactive Three.js
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {CHILIMO_INFO.name} • Burayu Campus • Mooraa Mana Barumsaa 3D
              </p>
            </div>
          </div>

          {/* Time of Day & Window Controls */}
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shadow-xl text-white">
            {/* Time of Day Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setTimeOfDay('day')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition font-medium ${
                  timeOfDay === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Ganama (Morning Sun)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ganama</span>
              </button>
              <button
                onClick={() => setTimeOfDay('sunset')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition font-medium ${
                  timeOfDay === 'sunset' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Dhiha (Golden Dusk)"
              >
                <Sunset className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dhiha</span>
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition font-medium ${
                  timeOfDay === 'night' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Halkan (Night Lights)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Halkan</span>
              </button>
            </div>

            {/* Auto-rotate toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-xl border transition ${
                autoRotate
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={autoRotate ? "Naanna'insa Dhaabi (Pause Spin)" : "Naanneessi (Auto Spin)"}
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition"
              title="Cufi (Close)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D CANVAS MOUNT CONTAINER */}
        <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />

        {/* ACTIVE HOTSPOT INFO CARD (FLOATING TOP-LEFT) */}
        {selectedBuildingInfo && (
          <div className="absolute top-20 left-4 z-20 max-w-sm w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Building className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {selectedBuildingInfo.nameOromo}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedBuildingInfo.nameEnglish}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuildingInfo(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
                title="Cufi"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {selectedBuildingInfo.description}
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Hoggansa: <strong className="text-white">{selectedBuildingInfo.leadPerson}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Sa'aatii: <span className="text-slate-300">{selectedBuildingInfo.operationalHours}</span></span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
              {selectedBuildingInfo.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                >
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* COLLAPSIBLE BOTTOM CONTROL DOCK (Three.js skill directive: zero viewport occlusion) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4 pointer-events-none">
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 pointer-events-auto transition-all">
            
            {/* Dock Header with Collapse Toggle */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Bakkeewwan Mooraa (Campus Locations & Presets)</span>
              </div>
              <button
                onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold text-[11px] transition"
              >
                {isControlsCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Bani (Show Dock)</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Dhaabi (Collapse)</span>
                  </>
                )}
              </button>
            </div>

            {/* Hotspots Quick Switcher Buttons */}
            {!isControlsCollapsed && (
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {CAMPUS_3D_HOTSPOTS.map(h => {
                  const isActive = h.id === activeHotspotId;
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleSelectHotspot(h)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Camera className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span>{h.nameOromo.split('(')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
