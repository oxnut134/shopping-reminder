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
    const [itemsBought, setItemsBought] = useState<any>([]);
    const { executing, setExecuting, currentPage, setCurrentPage } = useAppContext();
    const router = useRouter();
    const [authChecking, setAuthChecking] = useState(true);
    const [inputMenu, setInputMenu] = useState([]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempName, setTempName] = useState(""); 
    const [deleteMode, setDeleteMode] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    console.log("executing:", executing);
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
            setItemsBought(response.data);
        } catch (error) {
            console.error("読み込みエラー:", error);
        }
    };
    useEffect(() => {
        getItemsBought();
    }, []);

    const getInputMenu = async () => {
        try {
            const response = await axios.get('/api/getInputMenu');
            setInputMenu(response.data);
        } catch (error) {
            console.error("読み込みエラー:", error);
        }
    };
    useEffect(() => {
        getInputMenu();
    }, []);
    const historyMenu = Array.from(new Set(inputMenu.map((item: any) => item.item_name)));


    const getItems = async () => {
        try {
            const response = await axios.get('/api/getItemsToBuy');
            setItems(response.data);
        } catch (error) {
            console.error("読み込みエラー:", error);
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    useEffect(() => {
        const init = async () => {
            await axios.get('/sanctum/csrf-cookie');
            getItems();
        };
        init();
    }, []);

    const handleGotoLog = async () => {
        router.push('../shopping_log');

    }

    const handleAdd = async () => {
        if (!itemName) return;
        if (executing) return;
        setExecuting(true);

        const newItem = { item_name: itemName, amount: amount, id: Date.now() };
        setItems([newItem, ...items]);
        try {
            await axios.get('/sanctum/csrf-cookie');

            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            await axios.post('/api/storeItem', {
                item_name: itemName,
                amount: amount,
            }, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                }
            });
            getItems();
            setItemName("");
            setAmount("");
            setExecuting(false);
        } catch (error) {
            console.error("エラー", error);
            setItemName("");
            setAmount("");
            setExecuting(false);
        }
    };


    const handleChecked = async (itemId: any) => {
        if (executing) return;
        setExecuting(true);
        let targetId;
        const newItem = items.map((item: any) => {
            if (item.id == itemId) {
                item = { ...item, is_checked: !item.is_checked };
                targetId = item.id;
                setIsChecked(item.is_checked);
            }
            return item;
        })
        setItems(newItem);
        const targetItem = newItem.find((item: any) => item.id === itemId);
        try {

            await handleTargetItem(targetItem);

        } catch (error) {
            console.error("エラー", RangeError);
        } finally {
            setExecuting(false);
        }

    }
    const handleTargetItem = async (targetItem: any) => {
        console.log("targetItem in handleTarget:", targetItem);
        try {
            await axios.get('/sanctum/csrf-cookie');

            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            await axios.post('/api/updateItemWithBoughtAt', {
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
    const handleSaveEdit = async (id: any) => {
        if (executing) return;
        setExecuting(true);
        const nextItems = items.map((i: any) => i.id == id ? { ...i, item_name: tempName } : i);
        setItems(nextItems);
        setEditingId(null);

        const target = nextItems.find((i: any) => i.id == id);
        if (target) {
            console.log("target:", target);
            await handleTargetItem(target);
        }
        setExecuting(false);
    };
    useEffect(() => {
        if (items.length != 0) { console.log(items); }
    }, [items]);
    const handleMode = async () => {
        setDeleteMode(!deleteMode);
    }
    const handleDelete = async (itemId: any) => {
        if (executing) return;
        setExecuting(true);

        const newItems = items.filter((i: any) => { return (i.id != itemId) });
        setItems(newItems);
        try {
            await axios.get('/sanctum/csrf-cookie');

            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            await axios.post('/api/deleteItem', {
                item_id: itemId,
            }, {
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                }
            });
            return;

        } catch (error) {
            console.error("エラー", error);
        } finally {
            setExecuting(false);
        }
    }
    const confirmDelete = (id: number) => {
        setDeleteId(id);  
        setShowModal(true); 
    };

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
            <div className="p-6 mt-4 max-w-md mx-auto bg-zinc-50 ">
                <Header />
                <div className="flex justify-end items-center mb-2">
                    <button
                        onClick={handleGotoLog}
                        className="m-3 bg-orange-500 text-white font-bold px-4 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        買い物記録
                    </button>
                </div>
                <h1 className="text-2xl font-bold mt-0 mb-2 text-orange-500 text-center">買う物メモ</h1>

                <div className="flex gap-2 mb-8">
                    <div className="flex flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-orange-500">
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAdd(); 
                                }
                            }}
                            placeholder="商品名（または右から選択）"
                            className="text-[15px] flex-1 py-2 px-3 text-base focus:outline-none"
                        />
                        <select
                            onChange={(e) => {
                                setItemName(e.target.value);
                                e.target.value = "";
                            }}
                            className="w-5 bg-zinc-100 border-l border-gray-200 py-0 px-0 text-gray-500 focus:outline-none cursor-pointer hover:bg-zinc-200"

                            value=""
                        >
                            <option value="" disabled>▼</option>
                            {historyMenu.map((name: any) => (
                                <option key={name as string} value={name as string}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-orange-500 text-white font-bold px-4 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        追加
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between border-b-2 pb-2">
                        <h2 className="text-lg font-semibold text-gray-700">今のリスト</h2>
                        <button
                            onClick={() => handleMode()}
                            className={`font-bold px-4 rounded-lg transition-colors ${deleteMode
                                ? "bg-yellow-500 text-white hover:bg-yellow-500"
                                : "bg-green-500 text-white hover:bg-green-400"
                                }`}  >
                            {deleteMode ? "消去モード" : "編集・ﾁｪｯｸモード"}
                        </button>
                    </div>
                    {items.length === 0 ? (
                        <p className="text-gray-400 text-sm">リストは空です</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.map((item: any, index: any) => (
                                <li key={index} className="py-3 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                                    
                                    {editingId === item.id && !deleteMode  ? (
                                        <input
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSaveEdit(item.id); 
                                                }
                                            }}
                                            onBlur={() => setEditingId(null)} 
                                            autoFocus
                                            className="flex-1 border border-orange-500 rounded me-2 px-2 py-1 outline-none"
                                        />
                                    ) : (
                                        <span
                                            onClick={() => {
                                                console.log("item.is_checked:",item.is_checked);
                                                if (item.is_checked) return;
                                                setEditingId(item.id);
                                                setTempName(item.item_name);
                                            }}
                                            className={`flex-1 font-medium cursor-pointer ${item.is_checked ? "text-gray-400 line-through" : "text-gray-800"}`}
                                        >
                                            {item.item_name}
                                        </span>
                                    )}
                                    {!deleteMode && (
                                        <button
                                            onClick={(e) => handleChecked(item.id)}
                                            className={`font-bold px-4 rounded-lg transition-colors ${item.is_checked
                                                ? "bg-orange-500 text-white hover:bg-orange-400"
                                                : "bg-green-500 text-white hover:bg-green-400"
                                                }`}  >
                                            ﾁｪｯｸ
                                        </button>)}
                                    {deleteMode && (
                                        <button
                                            onClick={() => confirmDelete(item.id)}
                                            className="font-bold px-4 rounded-lg transition-colors bg-yellow-500 text-white hover:bg-yellow-400">
                                            消去
                                        </button>)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">確認</h3>
                            <p className="text-gray-600 mb-6">この項目を消去してもよろしいですか？</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={() => {
                                        if (deleteId) handleDelete(deleteId);
                                        setShowModal(false);
                                    }}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                                >
                                    消去する
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
