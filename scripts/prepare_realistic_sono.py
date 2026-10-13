import fitz
import os

pdf_path = r'D:\Machas\Path to Medal\Books\Ganga hospital blocks book.pdf'
doc = fitz.open(pdf_path)

output_dir = 'public/ganga-sono'
os.makedirs(output_dir, exist_ok=True)

# Let's extract the key sonoanatomy figures with clean names
blocks = [
    {
        'id': 'supraclavicular',
        'page': 68,
        'title': 'Supraclavicular Brachial Plexus Block',
        'crop_box': (0.05, 0.40, 0.95, 0.92) # fractional crop of the page
    },
    {
        'id': 'interscalene',
        'page': 62,
        'title': 'Interscalene Brachial Plexus Block',
        'crop_box': (0.05, 0.45, 0.95, 0.95)
    },
    {
        'id': 'femoral',
        'page': 90,
        'title': 'Femoral Nerve & Fascia Iliaca Block',
        'crop_box': (0.05, 0.05, 0.95, 0.75)
    },
    {
        'id': 'axillary',
        'page': 82,
        'title': 'Axillary Brachial Plexus Block',
        'crop_box': (0.05, 0.05, 0.95, 0.70)
    },
    {
        'id': 'adductor_canal',
        'page': 126,
        'title': 'Adductor Canal Block (ACB)',
        'crop_box': (0.05, 0.35, 0.95, 0.95)
    },
    {
        'id': 'popliteal',
        'page': 114,
        'title': 'Popliteal Sciatic Nerve Block',
        'crop_box': (0.05, 0.35, 0.95, 0.95)
    },
    {
        'id': 'tap',
        'page': 122,
        'title': 'Transversus Abdominis Plane (TAP) Block',
        'crop_box': (0.05, 0.10, 0.95, 0.85)
    }
]

for b in blocks:
    pno = b['page'] - 1
    page = doc[pno]
    rect = page.rect
    w, h = rect.width, rect.height
    
    cb = b['crop_box']
    clip = fitz.Rect(cb[0] * w, cb[1] * h, cb[2] * w, cb[3] * h)
    
    # Render at 2.5x high resolution (180 DPI)
    pix = page.get_pixmap(clip=clip, dpi=180)
    out_path = os.path.join(output_dir, f"{b['id']}_real_sono.jpg")
    pix.save(out_path)
    print(f"Rendered {b['id']} -> {out_path} ({pix.width}x{pix.height})")

print("All realistic sonoanatomy images rendered!")
