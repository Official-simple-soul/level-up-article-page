<?php

namespace App\Models\Services;

class HardcodedListBannedTopicsDetector implements BannedTopicsDetectorInterface
{
    public function isAllowed(string $content): bool
    {
        $bannedTopics = ['machine learning', 'self-driving cars', 'us elections'];

        foreach ($bannedTopics as $bannedTopic) {
            if (str_contains(mb_strtolower($content), $bannedTopic)) {
                return false;
            }
        }

        return true;
    }
}
