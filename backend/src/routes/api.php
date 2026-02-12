<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});*/
use App\Http\Controllers\ItemController; // 👈 忘れずにインポート！

Route::middleware(['auth:sanctum'])->group(function () {
    // 1. 認証中のユーザー情報を返す（Breeze標準）
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // 2. 👈 これが「覚えてない？」の答え。あなたの「たまねぎ」を守る窓口です！
    Route::post('/storeItem', [ItemController::class, 'storeItem']);
    Route::get('/getItemsToBuy', [ItemController::class, 'getItemsToBuy']);
    Route::get('/getItemsBought', [ItemController::class, 'getItemsBought']);
    Route::post('/updateItem', [ItemController::class, 'updateItem']);
    Route::post('/updateItemWithBoughtAt', [ItemController::class, 'updateItemWithBoughtAt']);
    Route::get('/getInputMenu', [ItemController::class, 'getInputMenu']);
    Route::post('/deleteItem', [ItemController::class, 'deleteItem']);

    });
