using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DoAn_FW.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Web_ProjectFrameWork.Controllers
{
    public class GioHangController : Controller
    {
        public KhachHang DataKH()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            this.ViewBag.KH = KH;
            return KH;
        }
        public void DataCart()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            var context = new GioHang();
            var cart = context.ListGioHang(KH.MaKH);
            this.ViewBag.cart = cart;
        }
        public List<GioHang> GetDataCart()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            var context = new GioHang();
            var cart = context.ListGioHang(KH.MaKH);
            this.ViewBag.cart = cart;
            return cart;
        }
        public IActionResult Cart()
        {
            KhachHang kh = DataKH();
            DataCart();
            var context = new GioHang();
            var kmcontext = new KhuyenMai();
            List<object> ListSP = new List<object>();
            List<KhuyenMai> ListKM = kmcontext.ListKM();
            if (kh.MaKH != null && kh.MaKH > 0)
            {
                ListSP = context.ListCTSP(kh.MaKH);
            }
            ViewData["ListKM"] = ListKM;
            ViewData["ListSP"] = ListSP;
            return View();
        }
        public IActionResult InsertCart(GioHang g, int MaLoaiSP)
        {
            KhachHang kh = DataKH();
            if (kh.MaKH <= 0)
            {
                return RedirectToAction("DangNhap", "TaiKhoan");
            }

            List<GioHang> listgh = GetDataCart();
            var ghcontext = new GioHang();
            int count = 0;
            int check = 0;
            int sl = 0;
            foreach (var item in listgh)
            {
                if (item.MaTTSP == g.MaTTSP && item.MaKH == kh.MaKH)
                {
                    check = 1;
                    sl = item.SoLuong;
                }
            }
            g.MaKH = kh.MaKH;
            if (check == 1)
            {
                count = ghcontext.UpdateGH(g);
            }
            else
            {
                count = ghcontext.InsertGH(g);
            }

            return RedirectToAction("Cart", "GioHang");
        }
        public IActionResult InsertCart2(int id1, int id2, int MaLoaiSP)
        {
            KhachHang kh = DataKH();
            if (kh.MaKH <= 0)
            {
                return RedirectToAction("DangNhap", "TaiKhoan");
            }
            List<GioHang> listgh = GetDataCart();
            var ghcontext = new GioHang();
            GioHang g = new GioHang() { MaKH = kh.MaKH, MaTTSP = id1, SoLuong = 1 };
            int check = 0;
            foreach (var item in listgh)
            {
                if (item.MaTTSP == g.MaTTSP && item.MaKH == g.MaKH)
                {
                    check = 1;
                }
            }
            if (check == 1)
            {
                ghcontext.UpdateGH(g);
            }
            else
            {
                ghcontext.InsertGH(g);
            }
            return RedirectToAction("Cart", "GioHang");
        }
        public IActionResult InsertCart3(int id)
        {
            KhachHang kh = DataKH();
            if (kh.MaKH <= 0)
            {
                return RedirectToAction("DangNhap", "TaiKhoan");
            }
            List<GioHang> listgh = GetDataCart();
            var ghcontext = new GioHang();
            GioHang g = new GioHang() { MaKH = kh.MaKH, MaTTSP = id, SoLuong = 1 };
            int check = 0;
            foreach (var item in listgh)
            {
                if (item.MaTTSP == g.MaTTSP && item.MaKH == g.MaKH)
                {
                    check = 1;
                }
            }
            if (check == 1)
            {
                ghcontext.UpdateGH(g);
            }
            else
            {
                ghcontext.InsertGH(g);
            }
            return RedirectToAction("Cart", "GioHang");
        }
        public IActionResult DeleteCart(int id, int kh)
        {
            var ghcontext = new GioHang();
            int count = 0;
            count = ghcontext.DeleteGH(id, kh);
            return RedirectToAction("Cart", new RouteValueDictionary(new { Controller = "GioHang", Action = "Cart" }));
        }
    }
}
