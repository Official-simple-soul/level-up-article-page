<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

/**
 * Public Article Routes
 */
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{articleId}', [ArticleController::class, 'show']);
Route::get('/articles/{articleId}/comments', [ArticleController::class, 'comments']);

/**
 * Authenticated routes
 */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', fn() => Auth::user());

    // Article management
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::post('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

    // Option 1: Dedicated cover photo routes
    Route::post('/articles/{article}/cover', [ArticleController::class, 'updateCover']);
    Route::delete('/articles/{article}/cover', [ArticleController::class, 'deleteCover']);

    // Article tags
    Route::post('/articles/{article}/tags/{tag}', [ArticleController::class, 'attachTag']);
    Route::delete('/articles/{article}/tags/{tag}', [ArticleController::class, 'detachTag']);
    Route::get('/articles/{article}/tags', [ArticleController::class, 'tags']);

    // Comments
    Route::post('/articles/{articleId}/comments', [ArticleController::class, 'storeComment']);
    Route::put('/comments/{comment}', [CommentController::class, 'updateComment']);

    // Article versions
    Route::get('/articles/{article}/versions', [ArticleController::class, 'versions']);
    Route::post('/articles/{article}/versions/{version}/restore', [ArticleController::class, 'restore']);
});

/**
 * Users
 */
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::post('/register', [UserController::class, 'store']);
Route::post('/login', [UserController::class, 'login']);

// Protected user routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', fn() => Auth::user());
    Route::match(['put', 'post'], '/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

// Tags
Route::get('/tags', [TagController::class, 'index']);
Route::post('/tags', [TagController::class, 'store']);
