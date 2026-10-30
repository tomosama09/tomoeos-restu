<template>
  <div
    id="aero-bios-screen"
    class="aero-bios-screen select-none fixed inset-0 z-[4000] bg-black text-[#d0d0d0] font-mono text-[11px] sm:text-[12px] leading-[1.3] p-4 sm:p-6 overflow-hidden flex flex-col justify-between cursor-pointer"
    @click="$emit('skip')"
  >
    <!-- Top Block: Award BIOS & Energy Star Logo -->
    <div class="space-y-1">
      <div class="flex items-start justify-between">
        <div>
          <div class="font-bold text-white text-xs sm:text-sm">Phoenix - AwardBIOS v6.00PG, An Energy Star Ally</div>
          <div class="text-[#888888]">Copyright (C) 1984-2009, Award Software, Inc.</div>
          <div class="text-white mt-0.5">ASUS P5K-SE ACPI BIOS Revision 1201</div>
        </div>

        <!-- Energy Star ASCII Badge -->
        <div class="hidden sm:block text-right font-mono text-[9px] leading-tight text-amber-300">
          <pre class="m-0 font-mono">
   ,------------------,
  /   energy   ENERGY  \
 |     ★★      STAR     |
  \   ALLY    AWARD    /
   '------------------'
          </pre>
        </div>
      </div>

      <!-- CPU & RAM Specs -->
      <div class="mt-2.5 space-y-0.5 text-slate-300">
        <div>Main Processor : Intel(R) Core(TM)2 Quad CPU Q6600 @ 2.40GHz (4 CPUs)</div>
        <div>Memory Testing  : 8388608K OK  (Dual Channel DDR2-800)</div>
        <div class="text-[#888888]">CPU ID: 06FB   Patch ID: 00B6   System Bus: 1066MHz</div>
      </div>

      <!-- Drives Detection -->
      <div class="mt-2 space-y-0.5 text-slate-300">
        <div>Detecting SATA Port Drives ...</div>
        <div class="pl-4 text-white">SATA Port 1 : WDC WD5000AAKS-00V1A0 [500GB HDD Storage]</div>
        <div class="pl-4 text-white">SATA Port 2 : SSD 512GB (TomoeOS Volume 0, System Boot)</div>
        <div class="pl-4 text-white">SATA Port 3 : ATAPI iHAS124 Y BL0W DVD-RW Multi-Drive</div>
        <div class="pl-4 text-[#777777]">SATA Port 4 : None</div>
      </div>

      <!-- Peripherals & Display -->
      <div class="mt-1.5 space-y-0.5 text-[#aaaaaa]">
        <div>USB Devices Total: 1 Drive, 1 Keyboard, 1 Mouse, 2 Hubs</div>
        <div>Audio Controller : Realtek High Definition Azalia Audio ......... OK</div>
        <div>Display Adapter  : NVIDIA GeForce 8800 GT (512 MB GDDR3) ........ OK</div>
        <div>Display Mode     : 1920 x 1080 @ 60Hz 32-bit True Color ......... OK</div>
      </div>

      <!-- PCI Devices Listing Table -->
      <div class="mt-2 pt-1 border-t border-slate-700/80 font-mono text-[10px] sm:text-[11px] text-slate-300">
        <div class="text-[#888888] pb-0.5">PCI device listing ...</div>
        <div class="text-white border-b border-slate-700 pb-0.5">
          Bus No.  Device No.  Func No.  Vendor ID  Device ID  Device Class          IRQ
        </div>
        <div class="text-slate-300 space-y-0.5 pt-0.5">
          <div>   0        31          2        8086       2922     SATA Storage Host     19</div>
          <div>   1         0          0        10DE       0614     VGA Display Adapter   16</div>
          <div>   0        27          0        8086       293E     HD Audio Controller   22</div>
          <div>   0        25          0        8086       10BD     Gigabit Network LAN   20</div>
          <div>   0        29          0        8086       2934     USB Host Controller   23</div>
        </div>
      </div>

      <!-- DMI Pool & Bootloader Handshake -->
      <div class="mt-2 space-y-0.5 text-slate-200">
        <div>Verifying DMI Pool Data ........... Update Success</div>
        <div>Boot from SATA Port 2 (Active Boot Partition) ...</div>
        <div class="text-emerald-400 font-bold flex items-center gap-1">
          <span>Starting TomoeOS Boot Loader ...</span>
          <span class="animate-pulse">_</span>
        </div>
      </div>
    </div>

    <!-- Bottom BIOS Key Prompt -->
    <div class="pt-2 border-t border-slate-800 text-[10px] sm:text-[11px] text-[#888888] flex items-center justify-between">
      <span>Press DEL to enter SETUP | F8 for BBS POPUP | Click to skip</span>
      <span class="font-mono">10/30/2009-P35-ICH9-6A79O009C-00</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'skip'): void
}>()
</script>
