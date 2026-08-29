import dbConnection from "../helpers/dbConnection.js";
import { propertySchema } from "../helpers/schemas.js";
import { sanitizeURL } from "../helpers/constants.js";

// Change depending on the max property infos to respond
const MAX_LIMIT = 1000;

const langs = ["en", "ja", "ar", "fr"];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed ..." });
  }
  const connection = dbConnection();
  try {
    let {
      id,
      title,
      limit,
      start_date,
      end_date,
      adults,
      children,
      infants,
      propertyType,
      ...rest
    } = req.query;
    // Reject Unknown Queries

    // id validation
    id = Number(id);
    if (!isNaN(id)) {
      const query = `
        SELECT p.*, 
        JSON_OBJECTAGG(pt.language_code, JSON_OBJECT('title', pt.title, 'type', pt.type, 'description', pt.description, 'location', pt.location, 'amenities', pt.amenities)) as translations
        FROM property p 
            INNER JOIN property_translations pt ON p.id = pt.property_id
        WHERE p.id = ?
        GROUP BY p.id
      `;
      const [result] = await connection.query(query, [id]);
      if (!result.length) {
        return res.status(404).json({ message: "Property Not Found" });
      }
      const isValid = propertySchema.safeParse(result[0]);
      if (!isValid.success) {
        throw new Error(
          "Property Does not correspong valid format : ",
          isValid.error.issues.map((issue) => issue.message).join(", "),
        );
      }
      const titles = [];
      for (let lang of langs) {
        const curr_title =
          result[0]["translations"][lang].title +
          "-" +
          result[0]["translations"][lang].type;
        titles.push(sanitizeURL(curr_title));
      }
      if (!titles.includes(sanitizeURL(title)))
        return res.status(400).json({ message: "Property Not Found ..." });
      return res.status(200).json({ property: result[0] });
    }
    if (limit === undefined) limit = MAX_LIMIT;
    limit = Number(limit);
    // limit validation
    if (isNaN(limit)) {
      return res.status(400).json({ message: "Bad Request ..." });
    }
    limit = Math.min(Number(limit), MAX_LIMIT);
    // In future, refactor to an array of random ids, and pick from theme, order by rand have a performance overload in large db sizes
    const query = `
        SELECT p.id, p.images, p.blurred_images, p.max_pax, p.lifts_distance, p.size, p.beds, JSON_OBJECTAGG(pt.language_code, JSON_OBJECT('title', pt.title, 'type', pt.type)) as translations
        FROM property p INNER JOIN property_translations pt ON p.id = pt.property_id
        GROUP BY p.id
        ORDER BY RAND()
        LIMIT ?
    `;
    const [result] = await connection.query(query, [Number(limit)]);
    if (!result.length) {
      return res.status(404).json({ message: "No Bookings Found ..." });
    }
    const filteredResults = result.map((property, idx) => {
      return {
        id: property.id,
        image: JSON.parse(property.images)[0],
        blurred_image: JSON.parse(property.blurred_images)[0],
        max_pax: property.max_pax,
        lifts_distance: property.lifts_distance,
        ...property.translations,
        tag: Math.floor(Math.random() * 3),
        price: Math.floor(Math.random() * 10000 + 10000),
        beds: property.beds,
        size: property.size,
      };
    });
    return res.status(200).json({ properties: filteredResults });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error ..." });
  }
}
