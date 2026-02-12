<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // 👈 is_checked の後に boolean 型の menu カラムを追加
            $table->boolean('menu')->default(true)->after('is_checked');
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // ロールバック時にカラムを削除
            $table->dropColumn('menu');
        });
    }
};
