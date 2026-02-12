"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../../lib/axios";
import Header from "../components/Header";
import { useAppContext } from "../context/AppContext";

export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { executing, setExecuting } = useAppContext();
    const [serverError, setServerError] = useState("");
    const { currentPage, setCurrentPage } = useAppContext();
    useEffect(() => {
        setCurrentPage("register");
    }, []);

    const password = watch("password");

    const onSubmit = async (data: any) => {
        if (executing) return;
        setExecuting(true);
        setServerError("");

        try {
            await axios.get('/sanctum/csrf-cookie');

            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            await axios.post('/register', {
                ...data,
                password_confirmation: data.password_confirmation,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                }
            });
            window.location.href = "/toBuy";
        } catch (err: any) {
            setServerError("登録に失敗しました。内容を確認してください。");
            setExecuting(false);
        }
    };
    return (
        <div className="p-6 mt-6 max-w-md mx-auto bg-zinc-50 ">
            <Header />
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-orange-600 text-center">New Account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* 名前 */}
                    <div>
                        <input
                            {...register("name", { required: "名前は必須です" })}
                            placeholder="お名前"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
                    </div>

                    <div>
                        <input
                            {...register("email", {
                                required: "メールは必須です",
                                pattern: { value: /^\S+@\S+$/i, message: "メールの形式が正しくありません" }
                            })}
                            placeholder="メールアドレス"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            {...register("password", {
                                required: "パスワードは必須です",
                                minLength: { value: 8, message: "8文字以上必要です" }
                            })}
                            placeholder="パスワード"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            {...register("password_confirmation", {
                                required: "確認用パスワードを入力してください",
                                validate: (value) => value === password || "パスワードが一致しません"
                            })}
                            placeholder="パスワード（確認）"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{String(errors.password_confirmation.message)}</p>}
                    </div>

                    {serverError && <p className="text-red-600 font-bold text-sm text-center">{serverError}</p>}

                    <button
                        type="submit"
                        disabled={executing}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${executing ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
                            }`}
                    >
                        {executing ? "作成中..." : "アカウント作成"}
                    </button>
                </form>
            </div>
        </div>
    );
}
