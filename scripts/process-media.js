const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

const RAW_DIR = 'C:/Users/windows/Desktop/laparda_raw';
const BASE_MEDIA = path.join(__dirname, '../public/media');

const folders = [
  'projects',
  'videos',
  'home',
  'sewing',
  'washing',
  'installation',
  'fabrics',
  'about',
  'faq',
  'contact'
];

// Ensure all media directories exist
folders.forEach(f => {
  const dir = path.join(BASE_MEDIA, f);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function main() {
  console.log('--- Processing LA PARDA Media Assets ---');

  // Copy raw videos to public/media/videos
  const rawVideosDir = path.join(RAW_DIR, 'videos');
  const targetVideosDir = path.join(BASE_MEDIA, 'videos');
  if (fs.existsSync(rawVideosDir)) {
    const videoFiles = fs.readdirSync(rawVideosDir);
    for (const file of videoFiles) {
      const src = path.join(rawVideosDir, file);
      const dest = path.join(targetVideosDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied video: ${file} -> public/media/videos/${file}`);
    }
  }

  // Copy raw photos and convert HEIC to JPEG
  const rawProjectsDir = path.join(RAW_DIR, 'projects');
  const targetProjectsDir = path.join(BASE_MEDIA, 'projects');
  const processedImages = [];

  if (fs.existsSync(rawProjectsDir)) {
    const imageFiles = fs.readdirSync(rawProjectsDir);
    for (const file of imageFiles) {
      const src = path.join(rawProjectsDir, file);
      // Copy original HEIC to preserve untouched
      const destOriginal = path.join(targetProjectsDir, file);
      fs.copyFileSync(src, destOriginal);

      // Standardized base name (e.g. laparda1.jpg)
      let cleanName = file.replace(/\.HEIC$/i, '');
      if (cleanName === 'laprda1') cleanName = 'laparda1';
      if (cleanName === 'laprda7') cleanName = 'laparda7';
      const jpgFileName = `${cleanName}.jpg`;
      const destJpg = path.join(targetProjectsDir, jpgFileName);

      console.log(`Converting ${file} -> ${jpgFileName}...`);
      const inputBuffer = fs.readFileSync(src);
      try {
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.88
        });
        fs.writeFileSync(destJpg, outputBuffer);
        console.log(`✓ Created: public/media/projects/${jpgFileName} (${Math.round(outputBuffer.length / 1024)} KB)`);
        processedImages.push({
          original: file,
          name: cleanName,
          jpgPath: `/media/projects/${jpgFileName}`,
          heicPath: `/media/projects/${file}`
        });
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
      }
    }
  }

  // Create representative images for specific theme folders so all 9 pages have curated curtain imagery
  const distributeMap = [
    { from: 'laparda1.jpg', to: ['home/hero-curtains.jpg', 'about/atelier-1.jpg', 'fabrics/fabric-velvet.jpg'] },
    { from: 'laparda2.jpg', to: ['home/featured-1.jpg', 'sewing/custom-tailoring.jpg'] },
    { from: 'laparda3.jpg', to: ['home/featured-2.jpg', 'washing/care-delicate.jpg'] },
    { from: 'laparda4.jpg', to: ['home/featured-3.jpg', 'installation/cornice-mount.jpg'] },
    { from: 'laparda5.jpg', to: ['sewing/sewing-process.jpg', 'fabrics/fabric-sheer.jpg'] },
    { from: 'laparda7.jpg', to: ['washing/cleaning-steam.jpg', 'faq/curtain-care.jpg'] },
    { from: 'laparda8.jpg', to: ['installation/motorized-curtains.jpg', 'contact/showroom.jpg'] },
    { from: 'laparda9.jpg', to: ['about/craftsmanship.jpg', 'fabrics/fabric-blackout.jpg'] },
    { from: 'laparda11.jpg', to: ['sewing/lining-finish.jpg', 'home/banner.jpg'] },
    { from: 'laparda12.jpg', to: ['washing/packaging.jpg', 'about/team.jpg'] },
    { from: 'laparda13.jpg', to: ['fabrics/textured-linen.jpg', 'faq/measurement-guide.jpg'] },
    { from: 'laparda14.jpg', to: ['installation/ceiling-rail.jpg', 'contact/consultation.jpg'] }
  ];

  distributeMap.forEach(item => {
    const src = path.join(targetProjectsDir, item.from);
    if (fs.existsSync(src)) {
      item.to.forEach(targetRel => {
        const dest = path.join(BASE_MEDIA, targetRel);
        fs.copyFileSync(src, dest);
        console.log(`Copied ${item.from} -> public/media/${targetRel}`);
      });
    }
  });

  // Build Media Manifest
  const manifest = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    pages: {
      home: {
        heroImage: '/media/home/hero-curtains.jpg',
        heroVideo: '/media/videos/laparda6.MOV',
        videoPoster: '/media/projects/laparda2.jpg',
        featuredWorks: [
          '/media/projects/laparda2.jpg',
          '/media/projects/laparda3.jpg',
          '/media/projects/laparda4.jpg',
          '/media/projects/laparda5.jpg'
        ]
      },
      projects: {
        items: processedImages.map((img, idx) => ({
          id: `proj-${idx + 1}`,
          titleUz: `Zamonaviy parda loyihasi #${idx + 1}`,
          titleRu: `Современный проект штор #${idx + 1}`,
          image: img.jpgPath,
          originalHeic: img.heicPath,
          video: (idx === 0) ? '/media/videos/laparda6.MOV' :
                 (idx === 1) ? '/media/videos/laparda10.MOV' :
                 (idx === 2) ? '/media/videos/video1.MOV' :
                 (idx === 3) ? '/media/videos/video2.MOV' : null,
          room: (idx % 4 === 0) ? 'mehmonxona' : (idx % 4 === 1) ? 'yotoqxona' : (idx % 4 === 2) ? 'oshxona' : 'ofis',
          style: (idx % 3 === 0) ? 'neoklassika' : (idx % 3 === 1) ? 'modern' : 'minimalizm',
          hasBeforeAfter: (idx === 0 || idx === 2)
        }))
      },
      videos: [
        { id: 'v1', src: '/media/videos/laparda6.MOV', poster: '/media/projects/laparda2.jpg', titleUz: 'Parda o‘rnatish jarayoni', titleRu: 'Процесс установки штор' },
        { id: 'v2', src: '/media/videos/laparda10.MOV', poster: '/media/projects/laparda3.jpg', titleUz: 'Premium parda tuly va portyera', titleRu: 'Премиальные тюль и портьеры' },
        { id: 'v3', src: '/media/videos/video1.MOV', poster: '/media/projects/laparda4.jpg', titleUz: 'Dizaynerlik parda loyihasi', titleRu: 'Дизайнерский проект штор' },
        { id: 'v4', src: '/media/videos/video2.MOV', poster: '/media/projects/laparda5.jpg', titleUz: 'Yotoqxona uchun blackout pardalar', titleRu: 'Блэкаут шторы для спальни' }
      ],
      sewing: {
        banner: '/media/sewing/custom-tailoring.jpg',
        process: '/media/sewing/sewing-process.jpg',
        video: '/media/videos/video1.MOV',
        videoPoster: '/media/projects/laparda4.jpg'
      },
      washing: {
        banner: '/media/washing/care-delicate.jpg',
        steam: '/media/washing/cleaning-steam.jpg',
        packaging: '/media/washing/packaging.jpg',
        video: '/media/videos/laparda10.MOV',
        videoPoster: '/media/projects/laparda3.jpg'
      },
      installation: {
        banner: '/media/installation/cornice-mount.jpg',
        motorized: '/media/installation/motorized-curtains.jpg',
        ceilingRail: '/media/installation/ceiling-rail.jpg',
        video: '/media/videos/laparda6.MOV',
        videoPoster: '/media/projects/laparda2.jpg'
      },
      fabrics: {
        banner: '/media/fabrics/fabric-velvet.jpg',
        sheer: '/media/fabrics/fabric-sheer.jpg',
        blackout: '/media/fabrics/fabric-blackout.jpg',
        linen: '/media/fabrics/textured-linen.jpg',
        video: '/media/videos/video2.MOV',
        videoPoster: '/media/projects/laparda5.jpg'
      },
      about: {
        atelier: '/media/about/atelier-1.jpg',
        craftsmanship: '/media/about/craftsmanship.jpg',
        team: '/media/about/team.jpg',
        video: '/media/videos/video1.MOV',
        videoPoster: '/media/projects/laparda4.jpg'
      },
      faq: {
        care: '/media/faq/curtain-care.jpg',
        measurement: '/media/faq/measurement-guide.jpg'
      },
      contact: {
        showroom: '/media/contact/showroom.jpg',
        consultation: '/media/contact/consultation.jpg'
      }
    }
  };

  const libDir = path.join(__dirname, '../lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  const manifestPath = path.join(libDir, 'media-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✓ Media Manifest created at: lib/media-manifest.json`);
  console.log('--- Processing Completed Successfully ---');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
