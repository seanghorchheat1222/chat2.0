<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function request_Otp(Request $request){

        $request->validate([
          'email' => 'required|string|email'
        ]);

        $user = User::where("email", $request->email)->first();

        if($user){
            return response()->json([
                "status" => false,
                "message" => "Email already exit!",
            ], 409);
        }

        $otp = rand(100000, 999999);

        Cache::put("otp_" . $request->email, $otp, now()->addMinute());

        Mail::raw("Your OTP is: $otp", function ($message) use ($request){
            $message->to($request->email);
            $message->subject("Your OTP from Chat2.0");
        });

        return response()->json([
            "status" => true,
            "message" => "OTP sent successfully && expired in 1mins!",
        ], 200);
    
    }

    public function confirm_Otp(Request $request){

        $request->validate([
            "email" => "required|string|email",
            "otp" => "required|digits:6"
        ]);

        $otp = Cache::get("otp_" . $request->email);

        if(!$otp){
           return response()->json([
              "status" => false,
              "message" => "OTP expired or not found!"
           ], 400);
        }

        if($otp != $request->otp){
            return response()->json([
                "status" => false,
                "message" => "Invalid OTP!"
            ]);
        }
        
        cache::forget("otp_" . $request->email);

        return response()->json([
            "status" => true,
            "message" => "Verified successfully!"
        ], 200);
    }


    public function createUser(Request $request){

        $request->validate([
            "name" => "required|string|max:100",
            "email" => "required|string",
            "password" => "required|string"
        ]);

        $user = User::where("email", $request->email)->first();

        if($user){
            return response()->json([
                "status" => false,
                "message" => "Email already Exit!"
            ], 409);
        }

        $user = new User();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->email_verified_at = Carbon::now();

        $user->save();

        return response()->json([
            "status" => true,
            "message" => "Account created successfully!"
        ], 201);
    }

    
    public function getUser(Request $request){
       
       $user = User::with("Profile")->where("id", "!=", $request->id);

       if($request->search){
         $user = $user->where('name', 'LIKE', "%" . $request->search . "%" );
       }

       $user = $user->get();

       return response()->json([
        "status" => true,
        "data" => $user
       ], 200);
    }
}
