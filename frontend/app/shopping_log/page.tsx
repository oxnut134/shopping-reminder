"use client";

import Header from "../components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "../../lib/axios";
import { useRouter } from 'next/navigation';
import { useAppContext } from "../context/AppContext";

export default function ToBuyPage() {
    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [items, setItems] = useState<any>([]);
    const { executing, setExecuting, currentPage, setCurrentPage } = useAppContext();
    const router = useRouter();
    const [authChecking, setAuthChecking] = useState(true);
    const [targetItem, setTargetItem] = useState();

    useEffect(() => {
        setCurrentPage("toBuy"); 
    }, []);

    useEffect(() => {
        axios.get('/api/user')
            .then(() => {
                setAuthChecking(false); 
            })
            .catch(() => {
                window.location.href = "/login"; 
            });
    }, []);

    const getItemsBought = async () => {
        try {
            const response = await axios.get('/api/getItemsBought');
            setItems(response.data);
            console.log("itemsSuccess:", items, response.data);
        } catch (error) {
            console.error("読み込みエラー:", error);
            console.log("itemsFault:", items);
        }
    };

    useEffect(() => {
        getItemsBought();
    }, []);

    useEffect(() => {
        const init = async () => {
            await axios.get('/sanctum/csrf-cookie'); 
            getItemsBought(); 
        };
        init();
    }, []);

    const handleMenuList = async (itemId: any, itemName: any) => {
        if (executing) return;
        setExecuting(true);
        const currentItem = items.find((i: any) => i.id === itemId);
        if (!currentItem) {
            setExecuting(false);
            return;
        }
        const nextMenuStatus = !currentItem.menu;

        const newItem = items.map((item: any) => {
            if (item.item_name == itemName) {
                return { ...item, menu: nextMenuStatus };
            }
            return item;
        });
        setItems(newItem);
        const targetItem = newItem.find((item: any) => item.id === itemId);
        await handleTargetItem(targetItem);

        try {
            setExecuting(false);
        } catch (error) {
            console.error("エラー", RangeError);
        } finally {

        }

    }
    const handleTargetItem = async (targetItem: any) => {
        console.log(items);
        try {
            await axios.get('/sanctum/csrf-cookie');

            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            await axios.post('/api/updateItem', {
                item: targetItem,
            }, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                }
            });
            return;
     
        } catch (error) {
            console.error("エラー", error);
        } finally {

        }

    }


    const handleBackToBuy = async () => {
        if (executing) return;
        setExecuting(true);

        setExecuting(false);
        router.push('../toBuy');


    }

    if (authChecking) {
        return (
            <>
                <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
                    <p className="text-zinc-400 animate-pulse text-lg font-medium">
                        認証確認中...
                    </p>
                </div>
            </>
        );
    }
    return (
        <>
            <div className="p-6 mt-6 max-w-md mx-auto bg-zinc-50 ">
                <Header />
                <button
                    onClick={handleBackToBuy}
                    className="mt-3 text-blue-500 text-sm hover:underline"
                >
                    ← 戻る
                </button>
                <h1 className="text-2xl font-bold my-2 text-orange-600 text-center">買い物記録</h1>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">今のリスト</h2>
                    {items.length === 0 ? (
                        <p className="text-gray-400 text-sm">リストは空です</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.map((item: any, index: any) => {
                                const isFirstAppearance = items.findIndex((i: any) => i.item_name === item.item_name) === index;

                                return (
                                    <li key={index} className="py-2 flex items-center gap-x-2 border-b border-gray-50  animate-in fade-in slide-in-from-top-1">
                                        <span className="w-30 origin-left ml-1 text-sm scale-x-70 text-gray-800 ">
                                            {new Date(item.bought_at).toLocaleString("ja-JP", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })}
                                        </span>
                                        <span className="flex-1 -ml-8 text-base  text-gray-800  origin-left">{item.item_name}</span>
                                        <div className="w-15 flex justify-end shrink-0">
                                            {isFirstAppearance && (
                                                <button
                                                    onClick={() => handleMenuList(item.id, item.item_name)}
                                                    className={`text-sm scale-x-70 font-bold px-2 rounded-lg transition-colors ${item.menu
                                                        ? "bg-green-500 text-white hover:bg-green-400"
                                                        : "bg-orange-500 text-white hover:bg-orange-400"
                                                        }`}  >
                                                    {item.menu ? "ﾒﾆｭｰｵﾝ" : "ﾒﾆｭｰｵﾌ"}
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}
