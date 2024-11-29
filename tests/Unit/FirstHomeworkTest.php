<?php

namespace Tests\Unit;

use Exception;
use PHPUnit\Framework\TestCase;
use Illuminate\Support\Str;

/**
 * The point of this exercise is to learn PHP just a little bit.
 *
 * For the purposes of this task you are not allowed to use helpers from Laravel's Str class.
 *
 * Use only PHP builtin functions.
 *
 * Good luck, you're gonna need it.
 */
class FirstHomeworkTest extends TestCase
{
    private function previewer(
        string $haystack,
        string $needle,
        int $length = 0,
        string $replacement = '...'
    ) {
        return Str::excerpt($haystack, $needle, options: ['radius' => $length, 'omission' => $replacement]);
    }

    public function test_previewer(): void
    {
        $this->assertEquals(
            '...are enjoying lea...',
            $this->previewer('Hope you are enjoying learning PHP lol', 'enjoying', 4, '...')
        );

        $this->assertEquals(
            'This...',
            $this->previewer('This is some sentence', 'This', 0)
        );

        $this->assertEquals(
            'highlighting',
            $this->previewer('The previewer function could be useful when implementing search highlighting', 'highlighting', 0, '')
        );

        $this->assertEquals(
            '...℘ⓐℙℇž...',
            $this->previewer('your function should also handle non-latin characters like Łüḱḁ ℘ⓐℙℇž for example', '℘ⓐℙℇž', 0)
        );

        $this->assertEquals(
            '',
            $this->previewer('if the match is not found then an empty string should be returned', 'this phrase does not exist', 0)
        );
    }
}
