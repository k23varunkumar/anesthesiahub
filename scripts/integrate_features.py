with open('app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add imports
old_imp = "import {resolveAssetUrl} from '@/lib/utils';"
new_imp = """import {resolveAssetUrl} from '@/lib/utils';
import {SonoanatomyModal} from '@/components/sonoanatomy-modal';
import {ClinicalToolsModal} from '@/components/clinical-tools-modal';"""
assert old_imp in c, 'old_imp not found'
c = c.replace(old_imp, new_imp)

# 2. Add state
old_state = "const [showSpotterAnswer,setShowSpotterAnswer]=useState<boolean>(false);"
new_state = """const [showSpotterAnswer,setShowSpotterAnswer]=useState<boolean>(false);
 const [sonoModalOpen,setSonoModalOpen]=useState<boolean>(false);
 const [clinicalModalOpen,setClinicalModalOpen]=useState<boolean>(false);
 const [currentBlockId,setCurrentBlockId]=useState<string>('supraclavicular');"""
assert old_state in c, 'old_state not found'
c = c.replace(old_state, new_state)

# 3. Add buttons to top-actions
old_top = '<nav className="top-actions" aria-label="Explorer panels">'
new_top = """<nav className="top-actions" aria-label="Explorer panels">
    <Button
      variant="ghost"
      className="pg-quiz-btn"
      style={{background:sonoModalOpen?'#0f766e':'#ffffffd9',color:sonoModalOpen?'#ffffff':'#0f766e',border:'1px solid #0f766e33',borderRadius:10,padding:'0 12px',height:42,display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:700}}
      onClick={()=>setSonoModalOpen(true)}
      title="Interactive Ultrasound Sonoanatomy & Needle Simulator"
    >
      <Scan size={18}/>
      <span>USGRA Sono Simulator</span>
    </Button>
    <Button
      variant="ghost"
      className="pg-quiz-btn"
      style={{background:clinicalModalOpen?'#0369a1':'#ffffffd9',color:clinicalModalOpen?'#ffffff':'#0369a1',border:'1px solid #0284c733',borderRadius:10,padding:'0 12px',height:42,display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:700}}
      onClick={()=>setClinicalModalOpen(true)}
      title="Weight-Calibrated Drug Dosing & Crisis Checklists"
    >
      <Syringe size={18}/>
      <span>OT Drugs & Crisis (LAST/DAS)</span>
    </Button>"""
assert old_top in c, 'old_top not found'
c = c.replace(old_top, new_top)

# 4. Add modals before </main>
old_end = "  </Sheet>\n </main>;"
if old_end not in c:
    old_end = "  </Sheet>\r\n </main>;"
assert old_end in c, 'old_end not found'

new_end = """  </Sheet>

   {sonoModalOpen && (
     <SonoanatomyModal
       initialBlockId={currentBlockId}
       onClose={()=>setSonoModalOpen(false)}
       onSelectAtlasStructure={(name)=>{
         const concept = atlas?.concepts.find(item => item.name.toLowerCase().includes(name.toLowerCase()));
         if(concept) choose(concept);
       }}
     />
   )}

   {clinicalModalOpen && (
     <ClinicalToolsModal
       onClose={()=>setClinicalModalOpen(false)}
     />
   )}
 </main>;"""

c = c.replace(old_end, new_end)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Successfully integrated Sonoanatomy & Clinical Tools in app/page.tsx!')
