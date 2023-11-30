import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDES));
    const hashPassword = bcrypt.hashSync(password,salt);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
