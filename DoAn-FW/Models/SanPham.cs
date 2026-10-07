using DoAn_FW.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace DoAn_FW.Models
{
    public class SanPham
    {
        public int MaTTSP { get; set; }

        public string TenSP { get; set; }

        public string HinhAnh { get; set; }

        public int MaLoaiSP { get; set; }

        public int MaTH { get; set; }

        public long Gia { get; set; }

        public long GiaKM { get; set; }

        public int SoLuong { get; set; }

        public string MauSac { get; set; }

        public int Ram { get; set; }

        public int BoNhoTrong { get; set; }

        public int Pin { get; set; }

        public float kichthuocmanhinh { get; set; }

        public string Cameratruoc { get; set; }

        public string Camerasau { get; set; }

        public string Cpu { get; set; }

    }
}
