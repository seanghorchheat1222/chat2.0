<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{

    public function setProfile(Request $request)
    {

        $request->validate([
            "user_id" => "required"
        ]);
 
        $user = User::find($request->user_id);

        if(!$user){
            return response()->json([
                "status" => false,
                "message" => "User does not Exit!"
            ], 400);
        }

        $profile = Profile::where("user_id", $request->user_id)->first();

        if ($profile) {

            $profile->user_id = $request->user_id;
            $profile->date_birth = $request->date_birth;
            $profile->address = $request->address;

            if ($request->hasFile("profile_img")) {
                if ($profile->profile_img) {
                    Storage::disk("public")->delete($profile->profile_img);
                }
                $profile->profile_img = $request->file("profile_img")->store("profiles", "public");
            }

            if ($request->hasFile("profile_banner")){
                if ($profile->profile_banner) {
                    Storage::disk("public")->delete($profile->profile_banner);
                }
                $profile->profile_banner = $request->file("profile_banner")->store("banners", "public");
            }

            $profile->update();

            return response()->json([
                "status" => true,
                "message" => "Profiles updated successfully!"
            ], 200);
        }

        $profile = new Profile();

        $profile->user_id = $request->user_id;
        $profile->date_birth = $request->date_birth;
        $profile->address = $request->address;

        if ($request->hasFile("profile_img")) {
            $profile->profile_img = $request->file("profile_img")->store("profiles", "public");
        }

        if ($request->hasFile("profile_banner")) {
            $profile->profile_banner = $request->file("profile_banner")->store("banners", "public");
        }

        $profile->save();

        return response()->json([
            "status" => true,
            "message" => "Profiles setted successfully!"
        ], 201);
    }   

}
