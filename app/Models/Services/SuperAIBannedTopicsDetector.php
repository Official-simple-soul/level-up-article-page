<?php

namespace App\Models\Services;

class SuperAIBannedTopicsDetector implements BannedTopicsDetectorInterface
{
    public function isAllowed(string $content): bool
    {
        // TODO: implement some advanced checking

        return false;
    }
}
