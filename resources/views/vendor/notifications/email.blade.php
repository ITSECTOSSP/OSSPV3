<x-mail::message>

{{-- HEADER LOGO --}}
<div style="text-align: center; margin-bottom: 20px;">
    <img src="{{ url('ossp_logo.png') }}"
         alt="OSSP Logo"
         style="width: 80px; height: auto; margin-bottom: 10px;">
</div>

{{-- GREETING --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
# 👋 Hello!
@endif

---

{{-- MAIN MESSAGE --}}
@foreach ($introLines as $line)
{{ $line }}

@endforeach

---

{{-- 🎯 DCN HIGHLIGHT BOX --}}
@if(isset($dcn))
<div style="
    background: #f3f6ff;
    border-left: 5px solid #1a73e8;
    padding: 10px 15px;
    margin: 15px 0;
    border-radius: 6px;
">
    <strong>📄 DCN:</strong> {{ $dcn }}
</div>
@endif

{{-- ACTION BUTTON --}}
@isset($actionText)
<?php
    $color = match ($level) {
        'success' => 'success',
        'error' => 'error',
        default => 'primary',
    };
?>
<x-mail::button :url="$actionUrl" :color="$color">
🔍 {{ $actionText }}
</x-mail::button>
@endisset

---

{{-- OUTRO --}}
@foreach ($outroLines as $line)
{{ $line }}

@endforeach

---

{{-- SIGNATURE --}}
@if (! empty($salutation))
{{ $salutation }}
@else
Regards,<br>
<strong>{{ config('app.name') }}</strong>
@endif

{{-- FOOTER NOTE --}}
<x-slot:subcopy>
If you're having trouble clicking the button above, copy and paste the URL below into your browser:

<span class="break-all">{{ $actionUrl }}</span>
</x-slot:subcopy>

</x-mail::message>