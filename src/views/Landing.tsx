import { Field, Form, Formik } from "formik";
import BackendManager from "../utils/BackendManager";
import Fetcher from "../utils/Fetcher";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div className="prose h-screen min-w-full flex justify-center">
            <div className="items-center flex flex-col justify-center h-full w-fit">
                <h1 className="mb-0">Welcome 👋</h1>
                <p>Let's set up your environment and connect to Subsonic!</p>
                <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{ username: '', password: '', url: '' }}
                    validate={values => {
                        const errors: Record<string, string> = {};
                        if (!values.username) {
                            errors.username = 'Required';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        if (!values.url) {
                            errors.url = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        const urlFormatted = `http://${values.url}`;
                        var backendManager = new BackendManager();
                        await backendManager.Initialize();
                        var salt = Fetcher.generateSalt();
                        var token = await Fetcher.generateToken(values.password, salt);
                        
                        // await backendManager.SetUserData({ username: values.username, token: token, url: values.url, salt: salt});
                        var fetcher = new Fetcher(urlFormatted, values.username, token, salt);
                        try {
                            await fetcher.Ping();
                            backendManager.SetUserData({ username: values.username, token: token, url: urlFormatted, salt: salt});
                            navigate("/");

                        }
                        catch (e) {
                            console.error(e);
                            alert("Could not connect to Subsonic server");
                        }
                    }}
                >
                    {({ isSubmitting, errors }) =>
                    (

                        <Form className="w-full">
                            <div className="form-control mb-4">
                                <label className="input input-bordered flex items-center gap-2 w-full bg-base-300">
                                    🧑
                                    <Field className="grow" placeholder="Username" name="username" />
                                </label>
                                <div className="label">
                                    {errors.username && <span className="label-text text-error">{errors.username}</span>}
                                </div>
                            </div>
                            <div className="form-control mb-4">
                                <label className="input input-bordered flex items-center gap-2 w-full bg-base-300">
                                    🔑
                                    <Field className="grow" placeholder="Password" type="password" name="password" />
                                </label>
                                <div className="label">
                                    {errors.password && <span className="label-text text-error">{errors.password}</span>}
                                </div>
                            </div>
                            <div className="form-control mb-4">
                                <div className="join w-full flex">
                                    <label className="input input-bordered join-item flex items-center bg-base-200">
                                        http://
                                    </label>
                                    <label className="input input-bordered flex items-center gap-2 w-full bg-base-300 join-item">
                                        <Field className="grow" placeholder="Server URL" name="url" />
                                    </label>
                                </div>
                                <div className="label">
                                    {errors.url && <span className="label-text text-error">{errors.url}</span>}
                                </div>
                            </div>
                            <button disabled={isSubmitting} className="btn btn-primary w-full">{isSubmitting ? <span className="loading loading-spinner loading-xs" /> : "Connect"}</button>
                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    )
}