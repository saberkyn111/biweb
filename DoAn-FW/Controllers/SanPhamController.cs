using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DoAn_FW.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Web_ProjectFrameWork.Controllers
{
    public class SanPhamController : Controller
    {
        //Kiểm tra đăng nhập và lấy thông tin khách hàng gán vào ViewBag.KH
        public void DataKH()
        {
            var KH = new KhachHang();
            if (HttpContext.Session.GetString("KH") != null)
            {
                KH = JsonConvert.DeserializeObject<KhachHang>(HttpContext.Session.GetString("KH"));
            }
            this.ViewBag.KH = KH;
        }
        //Kiểm tra đăng nhập và lấy thông tin giỏ hàng của khách hàng gán vào ViewBag.Cart
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

        public IActionResult DanhSachSP(int pg = 1)
        {
            var context = new SanPhamContext();
            List<object> list = context.ListSPMoiNhat();
            int pageSize = 6;
            if (pg < 1) pg = 1;
            int recsCount = list.Count();
            var pager = new Pager(recsCount, pg, pageSize);

            int recSkip = (pg - 1) * pageSize;

            var data = list.Skip(recSkip).Take(pager.PageSize).ToList();

            this.ViewBag.Pager = pager;

            ViewData["list"] = data;
            ViewData["ListLoaiSP"] = context.ListLoaiSP();
            return View();
        }

        [HttpGet]
        public IActionResult Products(
            [FromQuery] List<string> MaLoaiSP,
            [FromQuery] List<string> Ram,
            [FromQuery] List<string> Memory,
            [FromQuery] List<string> BoNhoTrong,
            [FromQuery] List<string> ScreenSize,
            [FromQuery] List<string> MaTH, 
            [FromQuery] string search,
            [FromQuery] string sortOrder,
            int pg = 1)
        {
            DataKH();
            DataCart();
            var context = new SanPhamContext();

            var effectiveMemory = (Memory != null && Memory.Count > 0) ? Memory : BoNhoTrong;

            var query = context.BuildFilterQuery(out var parameters, MaLoaiSP, Ram, effectiveMemory, ScreenSize, MaTH, search, sortOrder);

            int pageSize = 9;
            List<object> list;

            list = context.FetchFilteredProducts(query, parameters);

            if (pg < 1) pg = 1;
            int recsCount = list.Count();
            var pager = new Pager(recsCount, pg, pageSize);

            int recSkip = (pg - 1) * pageSize;

            var data = list.Skip(recSkip).Take(pager.PageSize).ToList();

            this.ViewBag.Pager = pager;

            ViewData["list"] = data;
            ViewData["ListLoaiSP"] = context.ListLoaiSP();
            ViewData["ListHang"] = context.ListHang();
            ViewData["ListRam"] = context.ListRam();
            ViewData["ListMemory"] = context.ListMemory();
            ViewData["ListManHinh"] = context.ListManHinh();
            return View();
        }

        [HttpGet]
        public IActionResult ChiTietSP(int t, int l)
        {
            DataKH();
            DataCart();
            var context = new SanPhamContext();
            ViewData["CTSP"] = context.ChiTietSP(t);
            ViewData["ListDT"] = context.FilterSanPham(l, t);
            ViewData["ListBL"] = context.BinhLuans(t);
            ViewData["ListPK"] = context.FilterSanPham(3); //"Tạo một list phụ kiện có thể tìm thấy được với MaLoaiSP = 3"
            return View();
        }

        // Redirect legacy routes to modern Products catalog
        [HttpGet]
        public IActionResult DTDD(int pg = 1, int? math = null, string? search = null)
        {
            return RedirectToAction("Products", new { pg, search });
        }

        [HttpGet]
        public IActionResult MayTinhBang(int pg = 1, int? math = null, string? search = null)
        {
            return RedirectToAction("Products", new { pg, search });
        }

        [HttpGet]
        public IActionResult PhuKien(int pg = 1, int? math = null, string? search = null)
        {
            return RedirectToAction("Products", new { pg, search });
        }
    }
}

