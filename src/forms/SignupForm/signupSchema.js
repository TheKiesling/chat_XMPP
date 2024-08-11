import usernameRegex from "../../helpers/usernameRegex";
import { object, string } from "yup";

const signupSchema = object().shape({
    username: string()
        .test("username", "Invalid username", (value) => usernameRegex(value))
        .required("Username is required"),
    password: string().required("Password is required"),
    });

export default signupSchema;