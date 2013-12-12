%------------------------------------------------------------
% To test image process memory usage
% @author: Joshua Chi
%------------------------------------------------------------
-module(crop).
-export([do/0, start/0, so/0, fac/2, start2/0]).

fac(N, _V) when N == 0 -> 
  finished;
  
fac(N, V) when N > 0  -> 
  case V of 
    {crop, Path, ToPath, Width, Height, Left, Right} ->
        gm:convert(Path, ToPath, [{crop, Width, Height, Left, Right}]),
        so();
    _ ->
      ok
  end,
  fac(N-1, V).
  
do() ->
  receive
    {crop, Path, ToPath, Width, Height, Left, Right} ->
      gm:convert(Path, ToPath, [{crop, Width, Height, Left, Right}]);
    finished ->
      finished
  end.

so() ->
  [{<<"memory_usage">>,
    {struct,[{<<"total">>,T},
           {<<"processes">>,P},
           {<<"processes_used">>, Pu},
           {<<"system">>,_},
           {<<"atom">>,_},
           {<<"atom_used">>,_},
           {<<"binary">>,_},
           {<<"code">>,_},
           {<<"ets">>, _}]}},
    {<<"garbage_collections">>, Gc}] = statistics:get_memory_statistics(),
  io:format("#~p#: total: ~p~nprocesses:~p~nprocesses_used:~p~ngarbage_collections:~p~n~n", [time(), T/1024,P/1024,Pu/1024,Gc/1024]).

start2() ->
  V = {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop.jpg", 100, 100, 0 ,0},
  fac(1000, V),
  timer:sleep(5000),
  fac(10000, V).
  
start()->
  Crop_Pid = spawn(crop, do, []),
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  {H,S,M} = time(),
  Crop_Pid ! {crop, "/Users/jchi/Downloads/MB1.JPG", "/Users/jchi/Downloads/crop"++lists:flatten(io_lib:format("~p:~p:~p", [H,S,M]))++".jpg", 100, 100, 0 ,0},
  so(),
  Crop_Pid ! finished.
