# Excel Import Troubleshooting

## "Successfully imported 0 items"

Dit betekent dat je Excel-bestand niet correct is herkend. Hier zijn de mogelijke oorzaken:

### 1. ❌ Kolom Namen Kloppen Niet

**Dit kan niet meer voorkomen** - de app zoekt nu automatisch naar veel varianten.

Ondersteunde kolom namen:
- **Product:** `Article`, `Artikel`, `Name`, `Product`, `Item`
- **Brand:** `Brand`, `Merk`, `Store`, `Winkel` (optioneel)
- **Prijs:** `Price`, `Prijs`, `Cost`, `Kosten` (verplicht!)
- **Hoeveelheid:** `Quantity`, `Aantal`, `Amount`, `Size` (verplicht!)
- **Unit:** `Unit`, `Eenheid`, `UOM`, `Measure`, `Maat` (verplicht!)

### 2. ❌ Prijs of Hoeveelheid is Leeg

Zorg dat elke rij een waarde heeft in:
- Prijs kolom
- Hoeveelheid kolom
- Unit kolom

**Voorbeeld goed:**
```
Article | Price | Quantity | Unit
Milk    | 1.89  | 1        | L
```

**Voorbeeld fout:**
```
Article | Price | Quantity | Unit
Milk    |       |          | L        ← Fout: Price en Quantity zijn leeg
```

### 3. ❌ Getallen in Verkeerde Format

- Prijs moet een getal zijn: `1.89` ✓ (niet `€1.89` ✗)
- Hoeveelheid moet een getal zijn: `500` ✓ (niet `500mL` ✗)
- Gebruik **punt** als decimaal scheidingsteken: `1.89` ✓ (niet `1,89` ✗)

**Fout:**
```
Price
€1.89     ← heeft € symbool
1,89      ← foloseste komma als decimaal
```

**Correct:**
```
Price
1.89
0.99
2.50
```

### 4. ❌ Lege Rijen Bovenin

Zorg dat:
- **Rij 1 = Kolom Headers** (Article, Price, etc.)
- **Rij 2+ = Data rows**

**Fout:**
```
[Rij 1] Empty
[Rij 2] Empty
[Rij 3] Article | Price | Quantity | Unit  ← Headers op rij 3!
[Rij 4] Milk    | 1.89  | 1        | L
```

**Correct:**
```
[Rij 1] Article | Price | Quantity | Unit  ← Headers op rij 1
[Rij 2] Milk    | 1.89  | 1        | L
[Rij 3] Butter  | 4.20  | 250      | g
```

### 5. ❌ File Type is Verkeerd

Zorg dat je een Excel-bestand uploadt:
✓ `.xlsx` (Excel 2007+) - Aangeraden
✓ `.xls` (Excel 97-2003) - Ook ok
✗ `.csv` - Werkt niet
✗ `.txt` - Werkt niet
✗ Google Sheets (download als `.xlsx` eerst!)

## 🔍 Debugging

Wanneer je upload naar 0 items gaat:

1. **Check de fout message** in de modal - die geeft nu hints
2. **Kijk naar je kolom headers** - moet exact 1 van de ondersteunde namen zijn
3. **Controleer getallen format** - moet puntjes zijn, niet komma's
4. **Test met voorbeeld template** - zie EXCEL_TEMPLATE.md

## ✅ Werkende Voorbeeld

Kopieëer deze tab naar Excel en vul aan:

| Article | Brand | Price | Quantity | Unit | PurchaseDate | Notes |
|---------|-------|-------|----------|------|--------------|-------|
| Milk | AH | 1.89 | 1 | L | 2024-03-16 | Full fat |
| Cheese | Gouda | 5.99 | 400 | g | 2024-03-15 | Sliced |
| Bread | Jumbo | 1.50 | 1 | pcs | 2024-03-16 | Whole grain |

1. Zet dit in Excel
2. Save als `.xlsx`
3. Upload in de app
4. Zou moeten werken!

## 🆘 Nog Steeds Problemen?

Check in browser console (F12) wat de error messages zeggen. De backend logt nu ook debug info.

You kan ook proberen:
1. Test met het template bovenstaand
2. Zorg dat Excel niet open is in ander programma
3. Try een ander Excel bestand
4. Check je internet connection

