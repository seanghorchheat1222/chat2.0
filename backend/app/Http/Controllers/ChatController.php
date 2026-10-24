<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function createChat(Request $request)
    {
        return DB::transaction(function () use ($request) {

            $request->validate([
                "users" => "required|array|min:2",
                "sender_id" => "required",
                "body" => "required|string"
            ]);

            foreach ($request->users as $user) {
                $user = User::where('id', $user['id'])->first();

                if (!$user) {
                    return response()->json([
                        "status" => false,
                        "message" => "User does not exit!"
                    ], 404);
                }
            }

            $userIds = collect($request->users)
                ->pluck('id')
                ->unique()
                ->values();

            $existingConversation = ConversationParticipant::query()
                ->select('conversation_id')
                ->whereIn('user_id', $userIds)
                ->groupBy('conversation_id')
                ->havingRaw('COUNT(DISTINCT user_id) = ?', [$userIds->count()])
                ->first();

            if ($existingConversation) {
                return response()->json([
                    "status" => false,
                    "message" => "Conversation already exits!"
                ], 400);
            }

            $conversation = new Conversation();

            $conversation->save();

            foreach ($request->users as $user) {
                $conversationParticipant = new ConversationParticipant();

                $conversationParticipant->user_id = $user["id"];
                $conversationParticipant->conversation_id = $conversation->id;

                $conversationParticipant->save();
            };

            $message = new Message();

            $message->conversation_id = $conversation->id;
            $message->sender_id = $request->sender_id;
            $message->body = $request->body;

            $message->save();

            event(new MessageSent($message));

            return response()->json([
                "status" => true,
                "message" => "Conversation created sucessfully!"
            ], 201);
        });
    }

    public function sendMessage(Request $request)
    {

        $request->validate([
            "conversation_id" => "required",
            "sender_id" => "required",
            "body" => "required",
        ]);

        $user = User::where('id', $request->sender_id)->first();

        if (!$user) {
            return response()->json([
                "status" => false,
                "message" => "User does not exit!"
            ], 404);
        }

        $conversation = Conversation::where('id', $request->conversation_id)->first();

        if (!$conversation) {
            return response()->json([
                "status" => false,
                "message" => "Conversation does not exit!"
            ], 404);
        }


        $message = new Message();

        $message->conversation_id = $request->conversation_id;
        $message->sender_id = $request->sender_id;
        $message->body = $request->body;

        $message->save();

         $message->load('User.Profile');

        event(new MessageSent($message));

       

        return response()->json([
            "status" => true,
            "message" => "Message send successfully!"
        ], 201);
    }


    public function updateMessage(Request $request)
    {

        $request->validate([
            "conversation_id" => "required",
            "sender_id" => "required",
            "body" => "required",
        ]);

        $user = User::where('id', $request->sender_id)->first();

        if (!$user) {
            return response()->json([
                "status" => false,
                "message" => "User does not exit!"
            ], 404);
        }

        $conversation = Conversation::where('id', $request->conversation_id)->first();

        if (!$conversation) {
            return response()->json([
                "status" => false,
                "message" => "Conversation does not exit!"
            ], 404);
        }

        $oldMessage = Message::findOrFail($request->id);

        $oldMessage->conversation_id = $request->conversation_id;
        $oldMessage->sender_id = $request->sender_id;
        $oldMessage->body = $request->body;

        $oldMessage->save();

        event(new MessageSent($oldMessage));

        return response()->json([
            "status" => true,
            "message" => "Message updated successfully!"
        ], 200);
    }


    public function getConversationParticipant(Request $request)
    {

        $user = $request->user();

        $conversationIds = $user->ConversationParticipants()
            ->pluck('conversation_id');

        $data = ConversationParticipant::with([
            'User.Profile',
            'Conversation.messages' => function ($query) use ($user) {
                $query
                    ->latest()
                    ->limit(1);
            },
        ])
            ->whereIn('conversation_id', $conversationIds)
            ->where('user_id', '!=', $user->id)
            ->get();

        return response()->json([
            "status" => true,
            "data" => $data
        ], 200);
    }

    public function showMessage(Request $request)
    {

        $message = Message::where("conversation_id", $request->id)->with(["User.Profile"])->get();

        return response()->json([
            "status" => true,
            "data" => $message,
        ], 200);
    }

    public function deleteConversation(Request $request)
    {

        Conversation::where("id", $request->id)->delete();
        return response()->noContent();
    }
}
