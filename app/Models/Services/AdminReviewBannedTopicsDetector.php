<?php

namespace App\Models\Services;

class AdminReviewBannedTopicsDetector implements BannedTopicsDetectorInterface
{
    public function isAllowed(string $content): bool
    {
        // TODO: send an email to the admins to verify the posts

        return true;
    }
}
