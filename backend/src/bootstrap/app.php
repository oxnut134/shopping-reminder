<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // $middleware->validateCsrfTokens(except: [
        //     'api/*',
        // ]);
        $middleware->statefulApi();
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        //
    })
    // bootstrap/app.php

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi(); // 👈 これが Sanctum / CORS の一括スイッチです！
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
        $exceptions->shouldRenderJsonWhen(function ($request, $e) {
        if ($request->is('api/*')) {
            return true;
        }
        return $request->expectsJson();
    });
    })->create();
