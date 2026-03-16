# Cost Tracker - Excel Import Guide

## Excel Template Format

To import your data, create an Excel file with the following structure:

| Article | Brand | Price | Quantity | Capacity | Unit | PurchaseDate | Notes |
|---------|-------|-------|----------|----------|------|--------------|-------|
| Shampoo | Dove  | 4.99  | 1        | 500      | mL   | 2024-03-01   | Sale at Albert Heijn |
| Milk    | de Zeeuw | 1.89  | 1   | 1        | L    | 2024-03-16   | Full fat |
| Toilet Paper | Sappo | 12.50 | 8 | 4 | rolls | 2024-03-15 | 8 packs of 4 rolls |
| Pasta | Barilla | 1.50 | 1 | 500 | g | 2024-03-14 | Yellow box |
| Eggs | Various | 3.50 | 1 | 12 | pcs | 2024-03-12 | Box of 12 |

## Column Explanation

### Required Columns

**Article** - Name of the product (e.g., "Shampoo", "Milk", "Cheese")

**Price** - Total price paid (in euros) - use dots, not commas (e.g., 4.99 not 4,99)

**Quantity** - Number of items/packs purchased. This is separate from capacity!
  - Examples: 2 (for 2×1L bottles), 4 (for 4-pack), 8 (for 8 rolls), 1 (for single item)

**Capacity** - Size/content per individual item
  - Examples: 1 (for 1L bottle), 0.5 (for 500mL), 500 (for 500g), 4 (for 4-roll pack), 12 (for 12-egg carton)

**Unit** - Unit of measurement:
  - `mL` / `ml` - Milliliters
  - `L` - Liters  
  - `g` - Grams
  - `kg` - Kilograms
  - `pcs` / `pieces` - Individual items
  - `rolls` - Toilet paper, paper towels
  - `oz` - Ounces
  - Other custom units

**PurchaseDate** - Date of purchase (format: YYYY-MM-DD) - **Required!**
  - Must be provided (e.g., 2024-03-16)

### Optional Columns

**Brand** - Brand name (e.g., "Dove", "Albert Heijn", "ICA")

**Notes** - Any additional information (e.g., "Sale", "Location: AH", "Best before 2024-05-01")

### How Quantity × Capacity is Normalized

The app calculates a normalized price per unit using the formula:
```
Price Per Unit = Total Price ÷ (Quantity × Capacity)
```

**Real-world examples:**

| What You Bought | Quantity | Capacity | Unit | Total Price | Price Per Unit | Calculation |
|---|---|---|---|---|---|---|
| 2×1L milk bottles | 2 | 1 | L | €2.00 | €1.00/L | €2.00 ÷ (2 × 1) |
| 4×600mL milk bottles | 4 | 0.6 | mL | €1.00 | €0.42/mL | €1.00 ÷ (4 × 0.6) |
| 1 box (12 eggs) | 1 | 12 | pcs | €3.50 | €0.29/pc | €3.50 ÷ (1 × 12) |
| 8 rolls (4-roll packs) | 8 | 4 | rolls | €12.50 | €0.39/roll | €12.50 ÷ (8 × 4) |
| 1 shampoo bottle (500mL) | 1 | 500 | mL | €4.99 | €0.01/mL | €4.99 ÷ (1 × 500) |

## How to Create Your Excel File

1. **Open Excel or LibreOffice Calc**

2. **Create column headers in Row 1:**
   - Column A: Article (required)
   - Column B: Brand (optional)
   - Column C: Price (required)
   - Column D: Quantity (required)
   - Column E: Capacity (required)
   - Column F: Unit (required)
   - Column G: PurchaseDate (required)
   - Column H: Notes (optional)

3. **Enter your data starting from Row 2**

4. **Important formatting:**
   - Price: use decimal point (4.99, not 4,99)
   - Quantity: numbers only (1, 2, 4, 8, etc. - how many items/packs)
   - Capacity: numbers only (1, 0.6, 500, 12, etc. - size per item)
   - PurchaseDate: use YYYY-MM-DD format **(required!)**

5. **Save as:** 
   - `.xlsx` (Excel 2007+) - Recommended
   - `.xls` (Excel 97-2003) - Also supported

## Example Data

### Grocery Store Items

| Article | Brand | Price | Quantity | Capacity | Unit | PurchaseDate | Notes |
|---------|-------|-------|----------|----------|------|--------------|-------|
| Milk | AH | 1.89 | 1 | 1 | L | 2024-03-16 | Full fat |
| Cheese | Gouda | 5.99 | 1 | 400 | g | 2024-03-15 | Sliced |
| Bread | Jumbo | 1.50 | 1 | 1 | pcs | 2024-03-16 | Whole grain |
| Butter | Lurisia | 4.20 | 1 | 250 | g | 2024-03-14 | Salted |
| Orange Juice | Minute Maid | 2.99 | 2 | 1 | L | 2024-03-15 | 2×1L bottles |

### Household Items

| Article | Brand | Price | Quantity | Capacity | Unit | PurchaseDate | Notes |
|---------|-------|-------|----------|----------|------|--------------|-------|
| Shampoo | Dove | 4.99 | 1 | 500 | mL | 2024-03-10 | Moisturizing |
| Soap | Lux | 2.50 | 1 | 4 | pcs | 2024-03-12 | Pack of 4 |
| Cleaning Spray | Dettol | 3.49 | 1 | 750 | mL | 2024-03-14 | Multi-surface |
| Toilet Paper | Sappo | 12.50 | 8 | 4 | rolls | 2024-03-15 | 8 packs of 4 rolls |
| Laundry Detergent | Ariel | 6.99 | 1 | 1.5 | kg | 2024-03-08 | Powder |

## Tips for Best Results

✓ Keep column headers exactly as shown (Article, Brand, Price, Quantity, Capacity, Unit, PurchaseDate, Notes)

✓ **Separate Quantity from Capacity:**
  - Quantity = how many items/packs you bought
  - Capacity = size of each item/unit
  - Example: 2×1L milk = Quantity: 2, Capacity: 1

✓ Use simple, clear product names (not "Item #1")

✓ For prices, use decimal point: `4.99` ✓ (not `4,99` ✗)

✓ **PurchaseDate is required** - must be provided in YYYY-MM-DD format

✓ Use consistent units for similar items (all milk in L, not some in mL)

✓ For bulk packs, break it down:
  - Buying 8 rolls (4-roll packs)? Quantity: 8, Capacity: 4, Unit: rolls
  - Not: Quantity: 32, Capacity: 1

✓ Include notes about sales or special purchases for context

## After Import

Once you import your Excel file:
1. Check the results on the Products page
2. Products are automatically sorted by name
3. Use Search to find specific items
4. Sort by "Price per Unit" to compare value
5. View Statistics for averages and trends

## Issues?

- **Column names don't match?** - Copy the exact column names from this guide
- **Numbers not recognized?** - Use dots not commas (4.99 not 4,99)
- **Date format wrong?** - Use YYYY-MM-DD (2024-03-16)
- **ml/mL calculations missing?** - Use exactly "mL" in the Unit column

Happy tracking! 💰
