<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationParticipant extends Model
{
    public function Conversation(){
        return $this->belongsTo(Conversation::class);
    }

    public function User(){
        return $this->belongsTo(User::class);
    }
}
