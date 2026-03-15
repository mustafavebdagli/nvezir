import tkinter as tk
from tkinter import messagebox


def solve_n_queens(n):
    """
    N-Vezir probleminin tüm çözümlerini bulur.
    Her çözüm şu formatta tutulur:
    [
        ".Q..",
        "...Q",
        "Q...",
        "..Q."
    ]
    """
    solutions = []
    board = [["." for _ in range(n)] for _ in range(n)]

    used_columns = set()
    used_diag1 = set()  # row - col
    used_diag2 = set()  # row + col

    def is_safe(row, col):
        if col in used_columns:
            return False
        if (row - col) in used_diag1:
            return False
        if (row + col) in used_diag2:
            return False
        return True

    def place_queen(row, col):
        board[row][col] = "Q"
        used_columns.add(col)
        used_diag1.add(row - col)
        used_diag2.add(row + col)

    def remove_queen(row, col):
        board[row][col] = "."
        used_columns.remove(col)
        used_diag1.remove(row - col)
        used_diag2.remove(row + col)

    def save_solution():
        solution = []
        for row in board:
            solution.append("".join(row))
        solutions.append(solution)

    def backtrack(row):
        if row == n:
            save_solution()
            return

        for col in range(n):
            if is_safe(row, col):
                place_queen(row, col)
                backtrack(row + 1)
                remove_queen(row, col)

    backtrack(0)
    return solutions


class NQueensApp:
    def _init_(self, root):
        self.root = root
        self.root.title("N-Vezir Problemi - Satranç Tahtası Gösterimi")

        self.cell_size = 70
        self.board_margin = 40

        self.solutions = []
        self.current_index = 0
        self.n = 4

        self.create_widgets()

    def create_widgets(self):
        top_frame = tk.Frame(self.root)
        top_frame.pack(pady=10)

        tk.Label(top_frame, text="N değeri girin:", font=("Arial", 12)).pack(side=tk.LEFT, padx=5)

        self.n_entry = tk.Entry(top_frame, width=10, font=("Arial", 12))
        self.n_entry.pack(side=tk.LEFT, padx=5)
        self.n_entry.insert(0, "4")

        self.solve_button = tk.Button(
            top_frame,
            text="Çözümleri Bul",
            font=("Arial", 12, "bold"),
            command=self.solve_and_show
        )
        self.solve_button.pack(side=tk.LEFT, padx=5)

        self.info_label = tk.Label(self.root, text="Henüz çözüm oluşturulmadı.", font=("Arial", 12))
        self.info_label.pack(pady=5)

        self.canvas = tk.Canvas(self.root, width=500, height=500, bg="white")
        self.canvas.pack(pady=10)

        bottom_frame = tk.Frame(self.root)
        bottom_frame.pack(pady=10)

        self.prev_button = tk.Button(
            bottom_frame,
            text="Önceki Çözüm",
            font=("Arial", 11),
            command=self.show_previous_solution,
            state=tk.DISABLED
        )
        self.prev_button.pack(side=tk.LEFT, padx=10)

        self.next_button = tk.Button(
            bottom_frame,
            text="Sonraki Çözüm",
            font=("Arial", 11),
            command=self.show_next_solution,
            state=tk.DISABLED
        )
        self.next_button.pack(side=tk.LEFT, padx=10)

    def solve_and_show(self):
        value = self.n_entry.get().strip()

        if not value.isdigit():
            messagebox.showerror("Hata", "Lütfen pozitif bir tam sayı girin.")
            return

        n = int(value)

        if n <= 0:
            messagebox.showerror("Hata", "N değeri 0'dan büyük olmalıdır.")
            return

        self.n = n
        self.solutions = solve_n_queens(n)
        self.current_index = 0

        if not self.solutions:
            self.info_label.config(text=f"N = {n} için çözüm bulunamadı.")
            self.canvas.delete("all")
            self.prev_button.config(state=tk.DISABLED)
            self.next_button.config(state=tk.DISABLED)
            return

        self.info_label.config(
            text=f"N = {n} için toplam {len(self.solutions)} çözüm bulundu. Şu an 1. çözüm gösteriliyor."
        )

        self.update_buttons()
        self.draw_solution(self.solutions[self.current_index])

    def draw_solution(self, solution):
        self.canvas.delete("all")

        n = len(solution)
        canvas_size = self.board_margin * 2 + self.cell_size * n
        self.canvas.config(width=canvas_size, height=canvas_size)

        # Sütun numaraları
        for col in range(n):
            x = self.board_margin + col * self.cell_size + self.cell_size / 2
            y = self.board_margin / 2
            self.canvas.create_text(x, y, text=str(col), font=("Arial", 12, "bold"))

        # Satır numaraları
        for row in range(n):
            x = self.board_margin / 2
            y = self.board_margin + row * self.cell_size + self.cell_size / 2
            self.canvas.create_text(x, y, text=str(row), font=("Arial", 12, "bold"))

        # Tahta kareleri ve vezirler
        for row in range(n):
            for col in range(n):
                x1 = self.board_margin + col * self.cell_size
                y1 = self.board_margin + row * self.cell_size
                x2 = x1 + self.cell_size
                y2 = y1 + self.cell_size

                square_color = "#f0d9b5" if (row + col) % 2 == 0 else "#b58863"
                self.canvas.create_rectangle(x1, y1, x2, y2, fill=square_color, outline="black")

                if solution[row][col] == "Q":
                    self.canvas.create_text(
                        x1 + self.cell_size / 2,
                        y1 + self.cell_size / 2,
                        text="♛",
                        font=("Arial", int(self.cell_size / 2), "bold"),
                        fill="black"
                    )

    def show_previous_solution(self):
        if not self.solutions:
            return

        if self.current_index > 0:
            self.current_index -= 1
            self.draw_solution(self.solutions[self.current_index])
            self.info_label.config(
                text=(
                    f"N = {self.n} için toplam {len(self.solutions)} çözüm bulundu. "
                    f"Şu an {self.current_index + 1}. çözüm gösteriliyor."
                )
            )
            self.update_buttons()

    def show_next_solution(self):
        if not self.solutions:
            return

        if self.current_index < len(self.solutions) - 1:
            self.current_index += 1
            self.draw_solution(self.solutions[self.current_index])
            self.info_label.config(
                text=(
                    f"N = {self.n} için toplam {len(self.solutions)} çözüm bulundu. "
                    f"Şu an {self.current_index + 1}. çözüm gösteriliyor."
                )
            )
            self.update_buttons()

    def update_buttons(self):
        if not self.solutions or len(self.solutions) == 1:
            self.prev_button.config(state=tk.DISABLED)
            self.next_button.config(state=tk.DISABLED)
            return

        if self.current_index == 0:
            self.prev_button.config(state=tk.DISABLED)
        else:
            self.prev_button.config(state=tk.NORMAL)

        if self.current_index == len(self.solutions) - 1:
            self.next_button.config(state=tk.DISABLED)
        else:
            self.next_button.config(state=tk.NORMAL)


if _name_ == "_main_":
    root = tk.Tk()
    app = NQueensApp(root)
    root.mainloop()