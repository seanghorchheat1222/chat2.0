<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request){

        $request->validate([
            "email" => "required|email",
            "password" => "required|string"
        ]);

        $user = User::where("email", $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
           return response()->json([
             "status" => false,
             "message" => "Invalid email or password!"
           ], 401);
        }

        $token = $user->createToken(
            "chat2.0-browser",
            ["*"],
            now()->addHour(8),
            )->plainTextToken;
        
        return response()->json([
            "status" => true,
            "token" => $token
        ]);
    }
    
    public function currentUser(Request $request){

        $user = $request->user()->only(["id", "name", "email"]);

        $profile = Profile::where("user_id", $user["id"])->first();

        $data = [
             ...$user,
            "profile" => $profile
        ];

        return response()->json([
            "status" => true,
            "data" => $data,
        ], 200);
    }

    public function Logout(Request $request){

        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }

}
