<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class ItemController extends Controller
{
    public function index()
    {
        return Item::all();
    }

    public function storeItem(Request $request)
    {
        $request->validate(['item_name' => 'required']);

        return Item::create([
            'user_id'   => Auth::id(), 
            'item_name' => $request->item_name,
            'amount'    => $request->amount,
            'is_checked' => false,
        ]);
    }
    public function updateItem(Request $request)
    {
        $item = $request->item;
        $targetRecord = Item::where('user_id', Auth::id())
            ->where('id', $item['id'])
            ->first();
        $targetRecord->menu = $item['menu'];
        //Log::info('データ確認:', $targetRecord->toArray());

        if ($targetRecord) {
                Item::where('user_id', Auth::id())
                    ->where('item_name', $targetRecord->item_name) 
                    ->update(['menu' => $item['menu']]);
 
            return response()->json(['status' => 'ok']);
        }
    }
    public function updateItemWithBoughtAt(Request $request)
    {
        $item = $request->item;
        //Log::info('データ確認:', $item);
       $targetRecord = Item::where('user_id', Auth::id())
            ->where('id', $item['id'])
            ->first();
        $targetRecord->item_name = $item['item_name'];
        $targetRecord->menu = $item['menu'];
        $targetRecord->is_checked = $item['is_checked'];
        $targetRecord->bought_at = now();
        //Log::info('データ確認:', $targetRecord->toArray());
        $targetRecord->save();
        return response()->json(['status' => 'ok']);
    }

    public function getItemsToBuy()
    {
        $notCheckedItems = Item::where('user_id', Auth::id())
            ->where('is_checked', false)
            ->latest()
            ->get();
        return $notCheckedItems;
    }

    public function getItemsBought()
    {
        $checkedItems = Item::where('user_id', Auth::id())
            ->where('is_checked', true)
            ->latest('bought_at')
            ->get();
        return $checkedItems;
    }
    public function getInputMenu()
    {
        $checkedItems = Item::where('user_id', Auth::id())
            ->where('is_checked', true)
            ->where('menu', true)
            ->latest('bought_at')
            ->get();
        return $checkedItems;
    }
    public function deleteItem(Request $request )
    {
        $itemId=$request->item_id;
        Item::where('user_id', Auth::id())
        ->where('id',$itemId)
        ->delete();

        return;
    }
}
