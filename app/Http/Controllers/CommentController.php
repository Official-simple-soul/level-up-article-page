<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;

class CommentController
{
    public function update(Comment $comment, UpdateCommentRequest $request)
    {
        $newContent = $request->validated('content');

        $comment->content = $newContent;

        return response(status: 204);
    }
}
