<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        "user_id",
        "profile_img",
        "profile_banner",
        "date_birth",
        "address"
    ];

    public function User(){
      return $this->belongsTo(User::class, 'user_id');
    }
}
