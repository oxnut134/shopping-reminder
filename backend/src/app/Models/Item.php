<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /*return \App\Models\Item::create([
        'user_id'   => 1, // とりあえずゲストユーザー1番で固定
        'item_name' => $request->item_name,
        'amount'    => $request->amount,
        'is_checked'=> false,
    ]);*/
    protected $fillable=[
       'user_id', // とりあえずゲストユーザー1番で固定
        'item_name',
        'amount' ,
        'is_checked',
 
    ];
}
