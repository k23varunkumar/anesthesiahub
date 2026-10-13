# 💉 AnesthesiaHub 3D Atlas & PG Exam Master

An interactive, high-fidelity 3D Anatomical & Clinical Atlas customized for **Anesthesiology Postgraduate Residents (MD / DNB)**. Built with React, Three.js, WebGL, TailwindCSS, and clinical references from Ganga Hospital Regional Anesthesia, Barash, Miller, and Dorsch.

![AnesthesiaHub Banner](https://img.shields.io/badge/Specialty-Anesthesiology-00f0ff?style=for-the-badge)
![Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Key Features

### 1. 🎯 High-Yield Clinical Anesthesia Presets
- **Airway & Laryngeal Anatomy**: Cormack-Lehane grades, vocal cords, cricothyroid membrane, RLN vs SLN course.
- **Neuraxial & Spine (Epidural/Spinal)**: Tuffier's line (L4-L5), Ligamentum flavum "loss of resistance", Subarachnoid space, Conus medullaris.
- **Ultrasound Regional Blocks (USGRA)**:
  - Brachial Plexus: Interscalene, Supraclavicular ("bundle of grapes"), Infraclavicular, Axillary.
  - Lower Limb: Femoral nerve, Adductor canal (Saphenous), Sciatic nerve (Subgluteal & Popliteal).
  - Trunk & Abdominal Blocks: TAP block, ESP (Erector Spinae Plane), Quadratus Lumborum, Rectus Sheath.
- **Vascular Access**: Internal Jugular Vein (IJV triangles), Subclavian vein, Femoral vessels.
- **Cardiopulmonary & Hemodynamics**: Coronary blood supply, transesophageal echocardiography (TEE) windows.

### 2. ⚡ Electric Cyan Glow & X-Ray Ghost Transparency
- **Real-Time Mesh Highlighting**: Emissive cyan edge glow isolates target structures against full body context.
- **Bayer 4x4 Screen-Door Dithering**: Semi-transparent ghost anatomy prevents visual clutter while retaining 3D spatial depth.
- **Auto-Camera Focus**: Clicking any clinical preset smoothly re-centers and zooms the camera onto the target structure.

### 3. 🎓 PG Viva Voce & Ganga Hospital Sonoanatomy
- **Interactive Inspection Tabs**: Switch between standard anatomical details and dedicated **"🎓 PG Viva Voce & Exam"** notes.
- **USG Sonoanatomy Signatures**: Direct acoustic markers (e.g., hyper-echoic fascial planes, acoustic shadowing).
- **Needle Endpoints & Troubleshooting**: Ganga Hospital clinical block tips, LA volumes, local anesthetic systemic toxicity (LAST) precautions.

### 4. 📝 Interactive OSCE Spotter Mode
- Integrated exam spotter quiz modal for testing postgraduate recall of high-stakes structures under timed exam conditions.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/k23varunkumar/anesthesiahub.git
cd anesthesiahub

# Install dependencies
npm ci

# Launch local development server
npm run dev
```

Open your browser at `http://localhost:3016`.

---

## 🌐 Deploying to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push your code to the `main` branch:
   ```bash
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, select **GitHub Actions**
3. The site will automatically build and publish to:
   `https://<username>.github.io/anesthesiahub/`

---

## 📚 Academic References & Attribution
- **Ganga Hospital Regional Anesthesia & Sonoanatomy Compendium**
- **Clinical Anesthesia** (Paul G. Barash, Michael K. Cahalan, et al.)
- **Anesthesia Review for DNB Students** (Dr. Kaushik)
- **Understanding Anesthesia Equipment** (Dorsch & Dorsch)
- 3D Geometry derived from **BodyParts3D 4.0** (Database Center for Life Science, CC BY-SA 2.1 JP).
