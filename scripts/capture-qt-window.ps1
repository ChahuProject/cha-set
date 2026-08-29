Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;

public class WindowSnap {
    [DllImport("user32.dll")]
    public static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, uint nFlags);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hwnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }

    public static Bitmap Capture(IntPtr hwnd) {
        RECT rc;
        GetWindowRect(hwnd, out rc);
        int w = rc.Right - rc.Left;
        int h = rc.Bottom - rc.Top;
        if (w <= 0 || h <= 0) return null;
        Bitmap bmp = new Bitmap(w, h);
        using (Graphics g = Graphics.FromImage(bmp)) {
            IntPtr hdc = g.GetHdc();
            PrintWindow(hwnd, hdc, 2);
            g.ReleaseHdc(hdc);
        }
        return bmp;
    }
}
"@ -ReferencedAssemblies System.Drawing

$env:PATH = "D:\pengj\qt\6.10.1\msvc2022_64\bin;" + $env:PATH
$proc = Start-Process -FilePath "D:\pengj\cha-set\qt\build\QtChaSetDemo.exe" -PassThru
Start-Sleep -Milliseconds 2200

$bmp = [WindowSnap]::Capture($proc.MainWindowHandle)
if ($bmp -ne $null) {
    $bmp.Save("D:\pengj\cha-set\qt-shot.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "[capture-qt] Captured window to D:\pengj\cha-set\qt-shot.png"
} else {
    Write-Host "[capture-qt] Failed to capture window handle"
}

Stop-Process -Id $proc.Id -Force
