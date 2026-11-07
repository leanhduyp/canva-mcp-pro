$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
$pres = $ppt.Presentations.Open('C:\Users\mrduy\.gemini\antigravity\scratch\canva-mcp-pro\test_taste_deck.pptx', [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
$pres.Slides.Item(15).Export('C:\Users\mrduy\.gemini\antigravity\brain\0c273b01-9367-4f82-a2be-fc844b82be6d\slide_15_taste.png', 'PNG', 1920, 1080)
$pres.Close()
$ppt.Quit()
Write-Host "EXPORT_DONE"
