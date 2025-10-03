export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof Error && err.message === "Invalid file type") {
    return res.status(400).json({ error: "Only PDF and Image files are allowed" });
  }

  // Agar koi aur multer ka error aya
  if (err instanceof Error && err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }

  // Agar error multer ka nahi hai to next middleware ko de do
  next(err);
};
