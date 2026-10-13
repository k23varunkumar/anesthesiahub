import fitz
import os

pdf_path = r'D:\Machas\Path to Medal\Books\Ganga hospital blocks book.pdf'
doc = fitz.open(pdf_path)

output_dir = 'public/ganga-sono'
os.makedirs(output_dir, exist_ok=True)

blocks_of_interest = {
    'popliteal_sciatic': range(108, 122),
    'tap_block': range(120, 150),
    'esp_block': range(145, 164),
}

for name, p_range in blocks_of_interest.items():
    for pno in p_range:
        if pno >= len(doc):
            continue
        page = doc[pno]
        imgs = page.get_images()
        if imgs:
            for idx, img in enumerate(imgs):
                xref = img[0]
                base_img = doc.extract_image(xref)
                w, h = base_img["width"], base_img["height"]
                ext = base_img["ext"]
                if w > 200 and h > 150:
                    img_filename = f"{name}_p{pno+1}_img{idx+1}_{w}x{h}.{ext}"
                    img_dest = os.path.join(output_dir, img_filename)
                    with open(img_dest, "wb") as f_out:
                        f_out.write(base_img["image"])
                    print(f"Extracted {img_filename}")

print("Done extracting remaining blocks!")
