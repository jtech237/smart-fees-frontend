import { z } from "zod";

const credentialsSchema = z
.object({
  username: z.union([
    z.string().min(1, "Please enter username"),
    z.string().email(),
  ]),
  password: z.string().min(4, "Password is too short"),
})
.required();

type Credentials = z.infer<typeof credentialsSchema>;

export { credentialsSchema, type Credentials };
