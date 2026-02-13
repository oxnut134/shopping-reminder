<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ItemController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/storeItem', [ItemController::class, 'storeItem']);
    Route::get('/getItemsToBuy', [ItemController::class, 'getItemsToBuy']);
    Route::get('/getItemsBought', [ItemController::class, 'getItemsBought']);
    Route::post('/updateItem', [ItemController::class, 'updateItem']);
    Route::post('/updateItemWithBoughtAt', [ItemController::class, 'updateItemWithBoughtAt']);
    Route::get('/getInputMenu', [ItemController::class, 'getInputMenu']);
    Route::post('/deleteItem', [ItemController::class, 'deleteItem']);
    
});
