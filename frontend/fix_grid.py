import re

with open("src/pages/EmployeeRegistrationPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace <Grid container spacing={3}> with <div className="fluid-grid">
content = content.replace('<Grid container spacing={3}>', '<div className="fluid-grid">')
content = content.replace('</Grid>', '</div>')

# Replace <Grid item xs={12} sm={6}> with <div>
content = re.sub(r'<Grid item xs=\{12\} sm=\{6\}>', '<div>', content)

# Replace <Grid item xs={12}> with <div className="col-span-full">
content = re.sub(r'<Grid item xs=\{12\}>', '<div className="col-span-full">', content)

with open("src/pages/EmployeeRegistrationPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)
