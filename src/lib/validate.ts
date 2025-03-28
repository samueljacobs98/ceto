import { getVesselsSchema } from "./schema";

export function validateGetVessels(req: Request) {
  const { searchParams } = new URL(req.url);

  const sortBy = searchParams.get("sortBy");
  const pageNumber = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const imoNumber = searchParams.get("imoNumber");
  const name = searchParams.get("name");
  const internalName = searchParams.get("internalName");
  const flag = searchParams.get("particulars.flag");
  // const tags = searchParams.getAll("tags");

  return getVesselsSchema.safeParse({
    sortBy,
    pageNumber,
    pageSize,
    imoNumber,
    name,
    internalName,
    flag,
  });
}
