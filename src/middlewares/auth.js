export const adminAuth = (req, res, next) => {
  console.log("check admin");
  const token = "xyz";
  const isadminAuthorized = token === "xyz";
  isadminAuthorized ? next() : res.status(401).send("Admin not authorized");
};
