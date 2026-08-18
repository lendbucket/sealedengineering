import fs from "node:fs";

/**
 * Correct the Harris County windstorm boundary wording to match TDI's own.
 *
 * The shipped copy named Kemah, which is in Galveston County, and Baytown,
 * which TDI does not list. Both were inferred from a road on a map rather than
 * read off the department's page. TDI defines the area as "parts of Harris
 * County east of Highway 146" and names La Porte, Morgan's Point, Pasadena,
 * Seabrook, and Shoreacres.
 *
 * Source: https://www.tdi.texas.gov/tips/need-windstorm-inspection.html
 */
const SUBS = [
  [
    "src/data/cities.ts",
    "The single most important thing to know about engineering work in Harris County is that the Texas Department of Insurance windstorm boundary runs through it. The designated catastrophe area covers the part of the county east of Highway 146, which puts Seabrook, Kemah, La Porte, and the Baytown side inside the WPI-8 requirement while the rest of the county sits outside it. A reroof on one side of that line needs a certificate of compliance and the identical reroof on the other side does not.",
    "The single most important thing to know about engineering work in Harris County is that the Texas Department of Insurance windstorm boundary runs through it. TDI describes the designated catastrophe area as covering parts of Harris County east of Highway 146, and names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres among the areas covered, while the rest of the county sits outside it. A reroof inside that area needs a certificate of compliance and the identical reroof outside it does not.",
  ],
  [
    "src/data/cities.ts",
    "It depends on which side of Highway 146 it sits. The Texas Department of Insurance catastrophe area covers the part of Harris County east of Highway 146, so addresses in Seabrook, Kemah, La Porte, and the Baytown area fall inside it and most of the rest of the county does not. If the property is near that line, confirm before assuming either way, because the consequence of guessing wrong is a windstorm coverage gap.",
    "It depends where in the county it sits. TDI describes the catastrophe area as covering parts of Harris County east of Highway 146, and names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres among the covered areas. Most of the rest of the county is outside it. Because the department defines this by area rather than by one clean line on a map, confirm a specific address with TDI rather than assuming: the consequence of guessing wrong is a windstorm coverage gap.",
  ],
  [
    "src/data/posts/wpi-8-windstorm-explained.ts",
    "Harris County is split. The designated area covers the part east of Highway 146, which puts Seabrook, Kemah, La Porte, and the Baytown side inside the requirement while most of the county sits outside it. A reroof on one side of that road needs a certificate and the identical reroof on the other side does not.",
    "Harris County is split. TDI describes the designated area as covering parts of the county east of Highway 146, and names La Porte, Morgan's Point, Pasadena, Seabrook, and Shoreacres among the covered areas, while most of the county sits outside it. A reroof inside one of those areas needs a certificate and the identical reroof further west does not. Confirm a specific address with TDI rather than reading it off a road.",
  ],
];

let applied = 0;
for (const [file, from, to] of SUBS) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes(from)) {
    console.log(`MISS: ${file}`);
    continue;
  }
  fs.writeFileSync(file, src.split(from).join(to));
  applied++;
}
console.log(`applied ${applied}/${SUBS.length}`);
