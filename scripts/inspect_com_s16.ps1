$ppt = New-Object -ComObject PowerPoint.Application
try {
  $pres = $ppt.Presentations.Open('C:\Users\mrduy\.gemini\antigravity\scratch\canva-mcp-pro\test_deck_advanced.pptx', [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
  $s16 = $pres.Slides.Item(16)
  Write-Host "Slide 16 Shapes Count:" $s16.Shapes.Count
  for ($i = 1; $i -le $s16.Shapes.Count; $i++) {
    $sh = $s16.Shapes.Item($i)
    Write-Host "$i - Name: $($sh.Name) Left: $($sh.Left) Top: $($sh.Top) Width: $($sh.Width) Height: $($sh.Height)"
  }
  $pres.Close()
} finally {
  $ppt.Quit()
}
