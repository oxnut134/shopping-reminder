<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // 誰の持ち物か
            $table->string('item_name');   // 商品名
            $table->string('amount')->nullable(); // 個数
            $table->boolean('is_checked')->default(false); // 完了フラグ
            $table->boolean('menu')->default(true);
            $table->text('comment')->nullable(); // メモ
            $table->timestamp('bought_at')->nullable(); 
            $table->timestamps(); // 登録日・更新日 $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
