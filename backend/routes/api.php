<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('/currentuser', [AuthController::class, 'currentUser']);
        Route::post('/logout', [AuthController::class, 'Logout']);
    });



    Route::prefix('profile')->group(function () {
        Route::post('/setprofile', [ProfileController::class, 'setProfile']);
    });

    Route::prefix('chat')->group(function () {
        Route::post('/createchat', [ChatController::class, 'createChat']);
        Route::post('/sendmessage', [ChatController::class, 'sendMessage']);
        Route::post('/updatemessage/{id}', [ChatController::class, 'updateMessage']);
        Route::get('/getconversationparticipant', [ChatController::class, 'getConversationParticipant']);
        Route::get('/showmessage/{id}', [ChatController::class, 'showMessage']);
        Route::delete('/deleteconversation/{id}', [ChatController::class, 'deleteConversation']);
    });

    Route::prefix('user')->group(function () {
        Route::get('/getuser', [UserController::class, 'getUser']);
    });
});

Route::prefix('user')->group(function () {
    Route::post('/request_otp', [UserController::class, 'request_Otp']);
    Route::post('/confirm_otp', [UserController::class, 'confirm_Otp']);
    Route::post('/createuser', [UserController::class, 'createUser']);
});

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'Login']);
});


